/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/list/list';
import '@material/web/menu-surface/menu-surface';
import '@material/web/textfield/filled-text-field';

import {customElement} from 'lit/decorators';
import {literal} from 'lit/static-html';

import {Autocomplete} from './lib/autocomplete';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-autocomplete': MdFilledAutocomplete;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-autocomplete')
export class MdFilledAutocomplete extends Autocomplete {
  protected override readonly listTag = literal`md-list`;
  protected override readonly menuSurfaceTag = literal`md-menu-surface`;
  protected override readonly textFieldTag = literal`md-filled-field`;
}
