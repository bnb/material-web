/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {stringConverter} from '@material/web/controller/string-converter';
import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators';
import {html as staticHtml, StaticValue} from 'lit/static-html';

import {MenuSurface} from '../../menusurface/lib/menu-surface';
import {TextField} from '../../textfield/lib/text-field';

import {AutocompleteItem} from './autocompleteitem/autocomplete-item';

/** @soyCompatible */
export abstract class Autocomplete extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  // TextField properties
  // TODO(b/243143708): Add all the remaining text field properties
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) error = false;
  @property({type: String}) errorText = '';
  @property({type: String}) label?: string;
  @property({type: Boolean, reflect: true}) required = false;
  @property({type: String}) value = '';
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
  @query('.md3-autocomplete__menu-surface') menuSurface?: MenuSurface|null;
  // TODO(esgonzalez): Implement query list with getter
  // @query('.md3-autocomplete__list') list?: List|null;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`<div class="md3-autocomplete"
            @click=${this.handleClick}
            @focusout=${this.handleFocusout}
            @action=${this.handleAction}>
            ${this.renderTextField()}
            ${this.renderMenuSurface()}</div>`;
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.menuSurface!.anchor = this.textField!;
  }

  /** @soyTemplate */
  protected renderTextField(): TemplateResult {
    return staticHtml`<${this.textFieldTag}
      class="md3-autocomplete__text-field"
      ?disabled=${this.disabled}
      ?error=${this.error}
      errorText=${this.errorText}
      ?hasTrailingIcon=${this.hasTrailingIcon}
      ?hasLeadingIcon=${this.hasLeadingIcon}
      label=${this.label}
      value=${this.value}
      prefixText=${this.prefixText}
      suffixText=${this.suffixText}
      supportingText=${this.supportingText}
      supportingTextId=${this.supportingTextId}
      ?required=${this.required}
      placeholder=${this.placeholder}>
    </${this.textFieldTag}>`;
  }

  /** @soyTemplate */
  protected renderMenuSurface(): TemplateResult {
    return staticHtml`<${this.menuSurfaceTag}
      class="md3-autocomplete__menu-surface"
      .corner=${'BOTTOM_START'}
      ?stayOpenOnBodyClick=${true}
    >
      <${this.listTag}><slot></slot></${this.listTag}>
    </${this.menuSurfaceTag}>`;
  }

  isOpen() {
    return this.menuSurface?.open || false;
  }

  open() {
    this.menuSurface?.show();
    // TODO(b/242594859): Add once supported by textfield
    // this.textField.ariaExpanded = true;
  }

  close() {
    this.menuSurface?.close();
    // TODO(b/242594859): Add once supported by textfield
    // this.textField.ariaExpanded = false;
    // this.setActiveDescendant();
  }

  protected handleClick(event: PointerEvent) {
    // When clicking the list (not items nor text field) the menu should stay
    // open.
    if (this.isOpen() &&
        (event.target as Node)?.parentNode !== this.menuSurface) {
      this.close();
    } else {
      this.open();
    }
  }

  // TODO(b/243389569): Revisit focus control when extending textfield
  protected handleFocusout(event: FocusEvent) {
    if (this.isInComboBox(event.relatedTarget as Node)) {
      // This is not ideal because the textfield blurs focus state and then
      // refocuses.
      this.textField?.focus();
      return;
    }
    this.close();
  }

  handleAction(event: CustomEvent<{item: AutocompleteItem}>) {
    const detail = event.detail;
    this.value = detail.item.headline;
  }

  /**
   * Mimics `Node.contains()` while taking into consideration shadowroot
   * elements.
   */
  private isInComboBox(node: Node, target: Element = this) {
    let currentElement = node;
    while (currentElement && currentElement.parentNode) {
      if (currentElement === (target as Node)) {
        return true;
      } else if (currentElement.parentNode instanceof DocumentFragment) {
        currentElement = (currentElement.parentNode as ShadowRoot).host;
      } else {
        currentElement = currentElement.parentNode;
      }
    }
    return false;
  }
}
