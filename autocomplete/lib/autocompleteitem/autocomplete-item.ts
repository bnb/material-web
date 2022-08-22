/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ListItem} from '@material/web/list/lib/listitem/list-item';
import {ARIARole} from '@material/web/types/aria';

/** Base class for autocomplete item component. */
export class AutocompleteItem extends ListItem {
  override role: ARIARole = 'option';
}
