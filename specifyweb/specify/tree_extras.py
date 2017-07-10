import re
from contextlib import contextmanager
import logging
logger = logging.getLogger(__name__)

from django.db import models, connection
from django.db.models import F, Q, ProtectedError
from django.conf import settings

from specifyweb.businessrules.exceptions import BusinessRuleException

@contextmanager
def validate_node_numbers(table):
    try:
        validate_tree_numbering(table)
    except AssertionError:
        renumber_tree(table)
    yield
    validate_tree_numbering(table)

class Tree(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        model = type(self)
        self.rankid = self.definitionitem.rankid
        self.definition = self.definitionitem.treedef

        prev_self = None if self.id is None \
                    else model.objects.select_for_update().get(id=self.id)

        if prev_self is None:
            self.nodenumber = None
            self.highestchildnodenumber = None
        else:
            self.nodenumber = prev_self.nodenumber
            self.highestchildnodenumber = prev_self.highestchildnodenumber

        def save():
            super(Tree, self).save(*args, **kwargs)

        if prev_self is None:
            with validate_node_numbers(self._meta.db_table):
                adding_node(self)
                save()
        elif prev_self.parent_id != self.parent_id:
            with validate_node_numbers(self._meta.db_table):
                moving_node(self)
                save()
        else:
            save()

        try:
            model.objects.get(id=self.id, parent__rankid__lt=F('rankid'))
        except model.DoesNotExist:
            raise BusinessRuleException("Tree node's parent has rank greater than itself.")

        if model.objects.filter(parent=self, parent__rankid__gte=F('rankid')).count() > 0:
            raise BusinessRuleException("Tree node's rank is greater than some of its children.")

        if (prev_self is None
            or prev_self.name != self.name
            or prev_self.definitionitem_id != self.definitionitem_id
            or prev_self.parent_id != self.parent_id
        ):
            set_fullnames(self._meta.db_table,
                          self.definition.treedefitems.count(),
                          self.definition.fullnamedirection == -1)

    def accepted_id_attr(self):
        return 'accepted{}_id'.format(self._meta.db_table)

    @property
    def accepted_id(self):
        return getattr(self, self.accepted_id_attr())

    @accepted_id.setter
    def accepted_id(self, value):
        setattr(self, self.accepted_id_attr(), value)



def open_interval(model, parent_node_number, size):
    """Open a space of given size in a tree model under the given parent.
    The insertion point will be directly after the parent_node_number.
    Returns the instertion point.
    """
    # All intervals to the right of parent node get shifted right by size.
    model.objects.filter(nodenumber__gt=parent_node_number).update(
        nodenumber=F('nodenumber')+size,
        highestchildnodenumber=F('highestchildnodenumber')+size,
    )
    # All intervals containing the insertion point get expanded by size.
    model.objects.filter(nodenumber__lte=parent_node_number, highestchildnodenumber__gte=parent_node_number)\
        .update(highestchildnodenumber=F('highestchildnodenumber')+size)

    return parent_node_number + 1

def move_interval(model, old_node_number, old_highest_child_node_number, new_node_number):
    """Adjust the node numbers to move an interval and all of its children
    to a new nodenumber range. There must be a gap of sufficient size
    at the destination. Leaves a gap at the old node number range.
    """
    delta = new_node_number - old_node_number
    model.objects.filter(nodenumber__gte=old_node_number, nodenumber__lte=old_highest_child_node_number)\
        .update(nodenumber=F('nodenumber')+delta, highestchildnodenumber=F('highestchildnodenumber')+delta)

def close_interval(model, node_number, size):
    """Close a gap where an interval was removed."""
    # All intervals containing the gap get reduced by size.
    model.objects.filter(nodenumber__lte=node_number, highestchildnodenumber__gte=node_number)\
        .update(highestchildnodenumber=F('highestchildnodenumber')-size)
    # All intervals to the right of node_number get shifted left by size.
    model.objects.filter(nodenumber__gt=node_number).update(
        nodenumber=F('nodenumber')-size,
        highestchildnodenumber=F('highestchildnodenumber')-size,
    )

def adding_node(node):
    logger.info('adding node %s', node)
    model = type(node)
    parent = model.objects.select_for_update().get(id=node.parent.id)
    if parent.accepted_id is not None:
        raise BusinessRuleException('Adding node "{node.fullname}" to synonymized parent "{parent.fullname}".'
                                    .format(node=node, parent=parent))
    insertion_point = open_interval(model, parent.nodenumber, 1)
    node.highestchildnodenumber = node.nodenumber = insertion_point

def moving_node(to_save):
    logger.info('moving node %s', to_save)
    model = type(to_save)
    current = model.objects.get(id=to_save.id)
    size = current.highestchildnodenumber - current.nodenumber + 1
    new_parent = model.objects.select_for_update().get(id=to_save.parent.id)
    if new_parent.accepted_id is not None:
        raise BusinessRuleException('Moving node "{node.fullname}" to synonymized parent "parent.fullname".'
                                    .format(node=to_save, parent=new_parent))

    insertion_point = open_interval(model, new_parent.nodenumber, size)
    # node interval will have moved if it is to the right of the insertion point
    # so fetch again
    current = model.objects.get(id=current.id)
    move_interval(model, current.nodenumber, current.highestchildnodenumber, insertion_point)
    close_interval(model, current.nodenumber, size)

    # update the nodenumbers in to_save so the new values are not overwritten.
    current = model.objects.get(id=current.id)
    to_save.nodenumber = current.nodenumber
    to_save.highestchildnodenumber = current.highestchildnodenumber

def merge(node, into):
    from . import models
    logger.info('merging %s into %s', node, into)
    model = type(node)
    assert type(into) is model
    target = model.objects.select_for_update().get(id=into.id)
    assert node.definition_id == target.definition_id, "merging across trees"
    if into.accepted_id is not None:
        raise BusinessRuleException('Merging node "{node.fullname}" with synonymized node "{into.fullname}".'
                                    .format(node=node, into=into))
    target_children = target.children.select_for_update()
    for child in node.children.select_for_update():
        matched = [target_child for target_child in target_children
                   if child.name == target_child.name and child.rankid == target_child.rankid]
        if len(matched) > 0:
            merge(child, matched[0])
        else:
            child.parent = target
            child.save()

    for retry in range(100):
        try:
            node.delete()
            return
        except ProtectedError as e:
            related_model_name, field_name = re.search(r"'(\w+)\.(\w+)'$", e.args[0]).groups()
            related_model = getattr(models, related_model_name)
            assert related_model != model or field_name != 'parent', 'children were added during merge'
            related_model.objects.filter(**{field_name: node}).update(**{field_name: target})

    assert False, "failed to move all referrences to merged tree node"

def synonymize(node, into):
    logger.info('synonymizing %s to %s', node, into)
    model = type(node)
    assert type(into) is model
    target = model.objects.select_for_update().get(id=into.id)
    assert node.definition_id == target.definition_id, "synonymizing across trees"
    if target.accepted_id is not None:
        raise BusinessRuleException('Synonymizing "{node.fullname}" to synonymized node "{into.fullname}".'
                                    .format(node=node, into=into))
    node.accepted_id = target.id
    node.isaccepted = False
    node.save()
    if node.children.count() > 0:
        raise BusinessRuleException('Synonymizing node "{node.fullname}" which has children.'
                                    .format(node=node))
    node.acceptedchildren.update(**{node.accepted_id_attr().replace('_id', ''): target})

    if model._meta.db_table == 'taxon':
        node.determinations.update(preferredtaxon=target)
        from .models import Determination
        Determination.objects.filter(preferredtaxon=node).update(preferredtaxon=target)

def unsynonymize(node):
    logger.info('unsynonmizing %s', node)
    model = type(node)
    node.accepted_id = None
    node.isaccepted = True
    node.save()
    if model._meta.db_table == 'taxon':
        node.determinations.update(preferredtaxon=F('taxon'))

EMPTY = "''"
TRUE = "true"
FALSE = "false"

def OR(exprs):
    if len(exprs) == 0:
        return FALSE
    elif len(exprs) == 1:
        return exprs[0]
    else:
        return '({})'.format(' or '.join(exprs))

def IF(if_expr, then_expr, else_expr=EMPTY):
    if if_expr == TRUE:
        return then_expr
    elif if_expr == FALSE:
        return else_expr
    else:
        return 'if({}, {}, {})'.format(if_expr, then_expr, else_expr)

def CONCAT(exprs, separator=''):
    exprs = filter(lambda e: e != EMPTY, exprs)

    if len(exprs) == 0:
        return EMPTY
    elif len(exprs) == 1:
        return exprs[0]
    else:
        # use concat_ws because it skips nulls.
        return "concat_ws('{}', {})".format(separator, ', '.join(exprs))

def NAME(index):
    return 't{}.name'.format(index)

def IN_NAME(index):
    return 'd{}.isinfullname'.format(index)

def SEPARATOR(index):
    return 'd{}.fullnameseparator'.format(index)

def BEFORE(index):
    return 'd{}.textbefore'.format(index)

def AFTER(index):
    return 'd{}.textafter'.format(index)

def ID(table, index):
    return 't{}.{table}id'.format(index, table=table)

def NODENUMBER(index):
    return 't{}.nodenumber'.format(index)

def fullname_expr(depth, reverse):
    fullname = CONCAT([
        IF(IN_NAME(i),
           CONCAT([
               BEFORE(i),
               NAME(i),
               AFTER(i),
               IF( # include separator if anything comes after
                OR([
                    IN_NAME(j)
                    # if going from leaf to root, "after" means farther down, j = i+1 -> depth-1.
                    # if going from root to leaf, "after" means farther up, j = i-1 -> 0.
                    for j in (range(i+1, depth) if reverse else reversed(range(i)))
                ]),
                SEPARATOR(i)
               )
           ]))
        # forward is root to leaf
        # reverse is leaf to root
        # leaf is i = 0, root is i = depth-1
        for i in (range(depth) if reverse else reversed(range(depth)))
    ])

    # if node is not in fullname, its fullname is just its name
    return IF(IN_NAME(0), fullname, NAME(0))

def parent_joins(table, depth):
    return '\n'.join([
        "left join {table} t{1} on t{0}.parentid = t{1}.{table}id".format(j-1, j, table=table)
        for j in range(1, depth)
    ])

def definition_joins(table, depth):
    return '\n'.join([
        "left join {table}treedefitem d{0} on t{0}.{table}treedefitemid = d{0}.{table}treedefitemid".format(j, table=table)
        for j in range(depth)
    ])

def set_fullnames(table, depth, reverse=False, node_number_range=None):
    cursor = connection.cursor()
    sql = (
        "update {table} t0\n"
        "{parent_joins}\n"
        "{definition_joins}\n"
        "set {set_expr}\n"
        "where t{root}.parentid is null\n"
        "and t0.acceptedid is null\n"
    ).format(
        root=depth-1,
        table=table,
        set_expr="t0.fullname = {}".format(fullname_expr(depth, reverse)),
        parent_joins=parent_joins(table, depth),
        definition_joins=definition_joins(table, depth),
    )
    if node_number_range is not None:
        sql += "and t0.nodenumber between %s and %s\n"
    logger.debug('fullname update sql:\n%s', sql)
    return cursor.execute(sql, node_number_range)

def predict_fullname(table, depth, parentid, defitemid, name, reverse=False):
    cursor = connection.cursor()
    sql = (
        "select {fullname}\n"
        "from (select %(name)s as name,\n"
        "      %(parentid)s as parentid,\n"
        "      %(defitemid)s as {table}treedefitemid) t0\n"
        "{parent_joins}\n"
        "{definition_joins}\n"
        "where t{root}.parentid is null\n"
    ).format(
        root=depth-1,
        table=table,
        fullname=fullname_expr(depth, reverse),
        parent_joins=parent_joins(table, depth),
        definition_joins=definition_joins(table, depth),
    )
    cursor.execute(sql, {'name': name, 'parentid': parentid, 'defitemid': defitemid})
    fullname, = cursor.fetchone()
    return fullname


def validate_tree_numbering(table):
    logger.info('validating tree')
    cursor = connection.cursor()
    cursor.execute(
        "select count(*), count(distinct nodenumber), count(highestchildnodenumber)\n"
        "from {table}".format(table=table)
    )
    node_count, nn_count, hcnn_count = cursor.fetchone()
    assert node_count == nn_count == hcnn_count, \
        "found {} nodes but {} nodenumbers and {} highestchildnodenumbers" \
        .format(node_count, nn_count, hcnn_count)

    cursor.execute((
        "select count(*) from {table} t join {table} p on t.parentid = p.{table}id\n"
        "where t.rankid <= p.rankid\n"
    ).format(table=table))
    bad_ranks_count, = cursor.fetchone()
    assert bad_ranks_count == 0, \
        "found {} cases where node rank is not greater than it's parent." \
        .format(bad_ranks_count)

    cursor.execute((
        "select count(*) from {table} t join {table} p on t.parentid = p.{table}id\n"
        "where t.nodenumber not between p.nodenumber and p.highestchildnodenumber\n"
    ).format(table=table))
    not_nested_count, = cursor.fetchone()
    assert not_nested_count == 0, \
        "found {} nodenumbers not nested by parent".format(not_nested_count)

def path_expr(table, depth):
    return CONCAT([ID(table, i) for i in reversed(range(depth))], ',')

def print_paths(table, depth):
    cursor = connection.cursor()
    sql = "select t0.nodenumber as nn, {path} as path from {table} t0 {parent_joins} order by nn".format(
        table=table,
        path=path_expr(table, depth),
        parent_joins=parent_joins(table, depth),
    )
    cursor.execute(sql)
    for r in cursor.fetchall()[:100]:
        print r
    print sql

def renumber_tree(table):
    logger.info('renumbering tree')
    cursor = connection.cursor()

    # make sure rankids are set correctly
    cursor.execute((
        "update {table} t\n"
        "join {table}treedefitem d on t.{table}treedefitemid = d.{table}treedefitemid\n"
        "set t.rankid = d.rankid\n"
    ).format(table=table))

    # make sure there are no cycles
    cursor.execute((
        "select count(*) from {table} t\n"
        "join {table} p on t.parentid = p.{table}id\n"
        "where t.rankid <= p.rankid\n"
    ).format(table=table))
    assert (0, ) == cursor.fetchone(), "bad tree structure"

    # Get the tree ranks in leaf -> root order.
    cursor.execute("select distinct rankid from {} order by rankid desc".format(table))
    ranks = [rank for (rank,) in cursor.fetchall()]
    depth = len(ranks)

    # Construct a path enumeration for each node and set the
    # nodenumbers according to the lexical ordering of the paths. This
    # ensures ancestor node numbers come before descendents and
    # sibling nodes get consecutive ranges.
    cursor.execute("set @rn := 0")
    cursor.execute((
        "update {table} t\n"
        "join (select @rn := @rn + 1 as nn, p.id as id from \n"
        "         (select t0.{table}id as id, {path} as path\n"
        "          from {table} t0\n"
        "          {parent_joins}\n"
        "          order by path) p\n"
        ") r on t.{table}id = r.id\n"
        # Set the highestchildnodenumber to be the same as the
        # nodenumber.  This is correct for leaves, and interior nodes
        # will be adjusted in the next step.
        "set t.nodenumber = r.nn, t.highestchildnodenumber = r.nn\n"
    ).format(
        table=table,
        path=path_expr(table, depth),
        parent_joins=parent_joins(table, depth),
    ))

    # Adjust the highestchildnodenumbers working from the penultimate
    # rank downward towards the roots. The highest rank cannot have
    # any children, so all nodes there correctly have
    # highestchildnodenumber = nodenumber as set in the previous step.
    # Interior nodes are updated by inner joining against their
    # children so that nodes with no children are not updated leaving
    # highestchildnodenumber = nodenumber.
    for rank in ranks[1:]:
        cursor.execute((
            "update {table} t join (\n"
            "   select max(highestchildnodenumber) as hcnn, parentid\n"
            "   from {table} where rankid > %(rank)s group by parentid\n"
            ") as sub on sub.parentid = t.{table}id\n"
            "set highestchildnodenumber = hcnn where rankid = %(rank)s\n"
        ).format(table=table), {'rank': rank})

    # Clear the BadNodes and UpdateNodes flags.
    from .models import datamodel, Sptasksemaphore
    tree_model = datamodel.get_table(table)
    tasknames = [name.format(tree_model.name) for name in ("UpdateNodes{}", "BadNodes{}")]
    Sptasksemaphore.objects.filter(taskname__in=tasknames).update(islocked=False)
