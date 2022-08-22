/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles} from '../list/lib/listitem/list-item-styles.css';

import {AutocompleteItem} from './lib/autocompleteitem/autocomplete-item';

declare global {
  interface HTMLElementTagNameMap {
    'md-autocomplete-item': MdAutocompleteItem;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-autocomplete-item')
export class MdAutocompleteItem extends AutocompleteItem {
  static override styles = [styles];
}
