/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// TODO(b/243558385): remove compat dependencies
import {observer} from '@material/web/compat/base/observer.js';
import {redispatchEvent} from '@material/web/controller/events.js';
import {stringConverter} from '@material/web/controller/string-converter.js';
import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAssignedElements, state} from 'lit/decorators.js';
import {html as staticHtml, StaticValue} from 'lit/static-html.js';

import {List} from '../../list/lib/list.js';
import {MenuSurface} from '../../menusurface/lib/menu-surface.js';
import {TextField} from '../../textfield/lib/text-field.js';

import {AutocompleteItem} from './autocompleteitem/autocomplete-item.js';

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

  /**
   * The ID on the list element, used for SSR.
   */
  @property({type: String}) listId = 'autocomplete-list';
  /**
   * The ID prefix for the item elements, used for SSR.
   */
  @property({type: String}) itemIdPrefix = 'autocomplete-item';

  protected abstract readonly textFieldTag: StaticValue;
  protected abstract readonly menuSurfaceTag: StaticValue;
  protected abstract readonly listTag: StaticValue;

  @query('.md3-autocomplete__text-field') textField?: TextField|null;
  @query('.md3-autocomplete__menu-surface') menuSurface?: MenuSurface|null;
  @query('.md3-autocomplete__list') list?: List|null;

  @queryAssignedElements({flatten: true})
  protected slottedItems!: AutocompleteItem[];

  @state()  // tslint:disable-next-line:no-new-decorators
  @observer(function(this: Autocomplete) {
    this.updateSelectedItem();
    this.updateActiveDescendant();
  })
  protected item: AutocompleteItem|null = null;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`<div class="md3-autocomplete"
            @click=${this.handleClick}
            @focusout=${this.handleFocusout}
            @action=${this.handleAction}
            @input=${this.handleInput}
            @keydown=${this.handleKeydown}
            @keyup=${this.handleKeyup}>
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
      role=${'combobox'}
      aria-autocomplete=${'list'}
      aria-controls=${this.listId}
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
      <${this.listTag}
        class="md3-autocomplete__list"
        listId=${this.listId}
        role=${'listbox'}>
        <slot></slot>
      </${this.listTag}>
    </${this.menuSurfaceTag}>`;
  }

  isOpen() {
    return this.menuSurface?.open || false;
  }

  open() {
    this.menuSurface?.show();
    if (!this.textField) return;
    this.textField.ariaExpanded = 'true';
  }

  close() {
    this.menuSurface?.close();
    this.item = null;
    if (!this.textField) return;
    this.textField.ariaExpanded = 'false';
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
  protected handleFocusout() {
    if (this.matches(':focus-within')) {
      this.textField?.focus();
      return;
    }
    this.close();
  }

  protected handleAction(event: CustomEvent<{item: AutocompleteItem}>) {
    const detail = event.detail;
    this.value = detail.item.headline;
  }

  protected handleInput(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value;
    redispatchEvent(this, event);
  }

  protected handleKeydown(event: KeyboardEvent) {
    let bubble = true;
    const altKey = event.altKey;

    switch (event.key) {
      case 'Enter':
        if (this.item) {
          this.value = this.item.headline;
        }
        this.close();
        bubble = false;
        break;

      case 'Down':
      case 'ArrowDown':
        if (this.slottedItems.length > 0) {
          if (altKey) {
            this.open();
          } else {
            this.open();
            if (this.slottedItems.length > 1) {
              this.item = this.getNextItem();
            } else {
              this.item = this.slottedItems[0];
            }
          }
        }
        bubble = false;
        break;

      case 'Up':
      case 'ArrowUp':
        if (this.slottedItems.length) {
          if (this.item) {
            this.item = this.getPreviousItem();
          } else {
            this.open();
            if (!altKey) {
              this.item = this.slottedItems[this.slottedItems.length - 1];
            }
          }
        }
        bubble = false;
        break;

      case 'Esc':
      case 'Escape':
        if (this.isOpen()) {
          this.close();
        } else {
          this.value = '';
        }
        this.item = null;
        bubble = false;
        break;

      case 'Tab':
        if (this.item) {
          this.value = this.item.headline;
        }
        this.close();
        break;

      case 'Home':
        this.textField?.setSelectionRange(0, 0);
        this.item = null;
        bubble = false;
        break;

      case 'End':
        this.textField?.setSelectionRange(this.value.length, this.value.length);
        this.item = null;
        bubble = false;
        break;

      default:
        break;
    }

    if (bubble) return;
    event.stopPropagation();
    event.preventDefault();
  }

  protected handleKeyup(event: KeyboardEvent) {
    let bubble = true;

    switch (event.key) {
      case 'Backspace':
      case 'Left':
      case 'ArrowLeft':
      case 'Right':
      case 'ArrowRight':
        this.item = null;
        bubble = false;
        break;

      default:
        break;
    }

    if (bubble) return;
    event.stopPropagation();
    event.preventDefault();
  }

  private updateSelectedItem() {
    this.slottedItems.forEach((item, index) => {
      item.itemId = `${this.itemIdPrefix}-${index}`;

      if (this.item && item === this.item && this.list) {
        item.ariaSelected = 'true';

        // Scroll into view
        if (this.list.scrollTop + this.list.offsetHeight <
            item.offsetTop + item.offsetHeight) {
          this.list.scrollTop =
              item.offsetTop + item.offsetHeight - this.list.offsetHeight;
        } else if (this.list.scrollTop > item.offsetTop + 2) {
          this.list.scrollTop = item.offsetTop;
        }
      } else {
        item.ariaSelected = 'false';
      }
    });
  }

  private updateActiveDescendant() {
    if (!this.textField) return;

    if (this.item) {
      this.textField.ariaActiveDescendant = this.item.itemId;
    } else {
      this.textField.ariaActiveDescendant = '';
    }
  }

  private getPreviousItem() {
    if (this.item !== this.slottedItems[0] && this.item) {
      const index = this.slottedItems.indexOf(this.item);
      return this.slottedItems[index - 1];
    }
    return this.slottedItems[this.slottedItems.length - 1];
  }

  private getNextItem() {
    if (this.item !== this.slottedItems[this.slottedItems.length - 1] &&
        this.item) {
      const index = this.slottedItems.indexOf(this.item);
      return this.slottedItems[index + 1];
    }
    return this.slottedItems[0];
  }
}
