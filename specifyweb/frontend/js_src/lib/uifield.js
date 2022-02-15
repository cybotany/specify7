"use strict";

import _ from 'underscore';
import Q from 'q';
import Backbone from './backbone';


import {format} from './dataobjformatters';
import {fieldFormat} from './fieldformat';
import {addValidationAttributes, parseValue, resolveParser} from './uiparse';
import {handleDatePaste} from './components/partialdateui';
import {dayjs} from "./dayjs";

export default Backbone.View.extend({
        __name__: "UIField",
        render: function() {
            var fieldName = this.$el.attr('name');
            if (!fieldName) {
                console.error("missing field name", this.el);
                return this;
            }
            Q(this.model.getResourceAndField(fieldName))
                .spread(this._render.bind(this))
                .done();
            this.destructors = [];
            return this;
        },
        _render: function(resource, field) {
            if (!field) {
                console.error('unknown field', this.$el.attr('name'), 'in', this.model, 'element:', this.$el);
                return;
            }
            if (!resource) {
                // actually this probably shouldn't be an error. it can
                // happen, for instance, in the collectors list if
                // the collector has not been defined yet.
                console.error("resource doesn't exist");
                return;
            }
            var remote = _.isNull(resource) || resource != this.model;

            var readOnly = !this.$el.hasClass('for-search-form') &&
                    (remote || field.isRelationship || field.isReadOnly || this.$el.prop('readonly'));

            var fieldName = this.fieldName = field.name.toLowerCase();

            var formatter = field.getUiFormatter();

            field.isRelationship && this.$el.removeClass('specify-field').addClass('specify-object-formatted w-full');

            const parser = resolveParser(field) ?? {};

            if(field.isReadOnly){
              this.el.readonly = true;
              this.el.tabIndex = -1;
            }
            else
                addValidationAttributes(
                    this.el,
                    parser,
                );

            if(!readOnly){
              const changing = ()=>this.model.trigger('changing');
              this.el.addEventListener('input', changing);
              this.destructors.push(()=>
                this.el.removeEventListener('input', changing)
              );
            }

            const parserFunction = this.model.noValidation
                ? (value)=>({ isValid: true, value, parsed: value })
                : parseValue.bind(null, parser, this.el);

            const handleChange = ()=>this.inputChanged(parserFunction(this.el.value));
            const isDate = this.el.type === 'date';
            const eventName = isDate
                ? 'blur'
                : 'change';
            this.el.addEventListener(eventName, handleChange);
            this.destructors.push(() =>
                this.el.removeEventListener(eventName, handleChange)
            );

            // Handle date paste
            if(isDate){
                const handlePaste = (event)=>handleDatePaste(event,handleChange);
                this.el.addEventListener('paste', handlePaste);
                this.destructors.push(() =>
                    this.el.removeEventListener('paste', handlePaste)
                );
            }

            if (resource) {
                const fillItIn = ()=>{
                    const objFormat = field.isRelationship
                      ? format
                      : field.isTemporal()
                      ? (value) => dayjs(value).format('YYYY-MM-DD')
                      : _.bind(fieldFormat, null, field);

                    Promise.resolve(resource.rget(fieldName)).then(objFormat).then((value)=>{
                        this.el.value = value ?? '';
                    });
                };

                fillItIn();
                resource.on('change:' + fieldName, fillItIn);
            }

            if (readOnly) return;

            if (!this.model.noValidation){
                this.model.saveBlockers?.linkInput(this.el, fieldName);
                this.destructors.push(()=>
                  this.model.saveBlockers?.unlinkInput(this.el, fieldName)
                );
            }

            if (this.model.isNew() && formatter && formatter.canAutonumber()) {
                const autoNumberValue = formatter.value();
                autoNumberValue && this.model.set(this.fieldName, autoNumberValue);
            }
            handleChange();

        },
        remove() {
            this.destructors.forEach(destructor=>destructor());
            Backbone.View.prototype.remove.call(this);
        },
        inputChanged: function(result) {
            console.log('parse result:', result);
            const key = `parseError:${this.fieldName}`;
            if(result.isValid){
              this.model.saveBlockers?.remove(key);
              const oldValue = this.model.get(this.fieldName) ?? null;
              // Don't trigger unload protect needlessly
              if(oldValue !== result.parsed)
                this.model.set(this.fieldName, result.parsed);
            }
            else
              this.model.saveBlockers?.add(key, this.fieldName, result.reason);
        },
    });

