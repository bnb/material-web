/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {stringConverter} from '@material/web/controller/string-converter';
import {html, LitElement, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators';
import {html as staticHtml, StaticValue} from 'lit/static-html';

import {TextField} from '../../textfield/lib/text-field';

/** @soyCompatible */
export abstract class Autocomplete extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  // TextField properties
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) error = false;
  @property({type: String}) errorText = '';
  @property({type: String}) label?: string;
  @property({type: Boolean, reflect: true}) required = false;
  @property({type: String}) value = '';
  @property({type: String}) defaultValue = '';
  @property({type: String}) prefixText = '';
  @property({type: String}) suffixText = '';
  @property({type: Boolean}) hasLeadingIcon = false;
  @property({type: Boolean}) hasTrailingIcon = false;
  @property({type: String}) supportingText = '';
  @property({type: String}) supportingTextId = 'support';
  @property({type: String, reflect: true, converter: stringConverter})
  placeholder = '';

  protected abstract readonly textFieldTag: StaticValue;
  protected abstract readonly menuSurfaceTag: StaticValue;
  protected abstract readonly listTag: StaticValue;

  @query('.md3-autocomplete__text-field') textField?: TextField|null;
  // TODO(esgonzalez): Implement query menusurface/list with getters
  // @query('.md3-autocomplete__menu-surface') menuSurface?: MenuSurface|null;
  // @query('.md3-autocomplete__list') list?: List|null;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`<div class="md3-autocomplete">
            ${this.renderTextField()}
            ${this.renderMenuSurface()}</div>`;
  }

  /** @soyTemplate */
  protected renderTextField(): TemplateResult {
    return staticHtml`<${this.textFieldTag}
      class="md3-autocomplete__text-field"
      ?disabled=${this.disabled}
      .error=${this.error}
      .errorText=${this.errorText}
      .hasTrailingIcon=${this.hasTrailingIcon}
      .hasLeadingIcon=${this.hasLeadingIcon}
      .label=${this.label}
      .value=${this.value}
      .defaultValue=${this.defaultValue}
      .prefixText=${this.prefixText}
      .suffixText=${this.suffixText}
      .supportingText=${this.supportingText}
      .supportingTextId=${this.supportingTextId}
      .required=${this.required}
      .placeholder=${this.placeholder}>
    </${this.textFieldTag}>`;
  }

  /** @soyTemplate */
  protected renderMenuSurface(): TemplateResult {
    const textField = this.getTextField();

    return staticHtml`<${this.menuSurfaceTag}
      class="md3-autocomplete__menu-surface"
      .anchor=${textField}
      .corner=${'BOTTOM_START'}
    >
      <${this.listTag}><slot></slot></${this.listTag}>
    </${this.menuSurfaceTag}>`;
  }

  protected getTextField() {
    if (!this.textField) {
      this.connectedCallback();
      this.scheduleUpdate();
    }

    if (this.isUpdatePending) {
      this.scheduleUpdate();
    }

    return this.textField!;
  }
}
