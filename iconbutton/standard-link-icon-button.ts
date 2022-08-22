/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon';

import {customElement} from 'lit/decorators';
import {ClassInfo} from 'lit/directives/class-map';

import {styles as sharedStyles} from './lib/icon-button-styles.css';
import {LinkIconButton} from './lib/link-icon-button';
import {styles} from './lib/standard-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-standard-link-icon-button': MdStandardLinkIconButton;
  }
}

/** @soyCompatible */
@customElement('md-standard-link-icon-button')
export class MdStandardLinkIconButton extends LinkIconButton {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--standard': true,
    };
  }
}
