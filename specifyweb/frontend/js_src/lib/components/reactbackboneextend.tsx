/*
*
* Type-safe React wrapper for Backbone.View.extend
* It's like a gate between Backbone Views and React components
*
* */

'use strict';

import Backbone      from '../backbone';
import React         from 'react';
import ReactDOM      from 'react-dom';
import ErrorBoundary from './errorboundary';

export interface ReactBackboneExtendBaseProps {
	el: HTMLElement,
	remove: () => void,
}

export default <CONSTRUCTOR_PROPS, BACKBONE_PROPS extends ReactBackboneExtendBaseProps, COMPONENT_PROPS>({
	module_name,
	class_name,
	initialize,
	render_pre,
	render_post,
	remove,
	Component,
	get_component_props,
}: {
	module_name: string,
	class_name: string,
	initialize: (self: BACKBONE_PROPS, view_props: CONSTRUCTOR_PROPS) => void,
	render_pre?: (self: BACKBONE_PROPS) => void,
	render_post?: (self: BACKBONE_PROPS) => void,
	remove?: (self: BACKBONE_PROPS) => void,
	Component: (props: COMPONENT_PROPS) => JSX.Element,
	get_component_props: (self: BACKBONE_PROPS) => COMPONENT_PROPS
}): Record<string, unknown> =>
	Backbone.View.extend({
		__name__: module_name,
		className: class_name,
		initialize(props: CONSTRUCTOR_PROPS) {
			initialize(this, props);
		},
		render() {
			render_pre && render_pre(this);
			ReactDOM.render(<React.StrictMode>
				<ErrorBoundary>
					<Component
						{...get_component_props(this)}
					/>
				</ErrorBoundary>
			</React.StrictMode>, this.el);
			render_post && render_post(this);
			return this;
		},
		remove() {
			remove && remove(this);
			ReactDOM.unmountComponentAtNode(this.el);
			Backbone.View.prototype.remove.call(this);
		},
	});