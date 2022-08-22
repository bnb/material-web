/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon';

import {customElement} from 'lit/decorators';
import {ClassInfo} from 'lit/directives/class-map';

import {styles} from './lib/filled-styles.css';
import {LinkIconButton} from './lib/link-icon-button';
import {styles as sharedStyles} from './lib/icon-button-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-link-icon-button': MdFilledLinkIconButton;
  }
}

/** @soyCompatible */
@customElement('md-filled-link-icon-button')
export class MdFilledLinkIconButton extends LinkIconButton {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--filled': true,
    };
  }
}
