/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';
import {ClassInfo} from 'lit/directives/class-map';

import {IconButton} from './lib/icon-button';
import {styles as sharedStyles} from './lib/icon-button-styles.css';
import {styles} from './lib/outlined-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-icon-button': MdOutlinedIconButton;
  }
}

@customElement('md-outlined-icon-button')
export class MdOutlinedIconButton extends IconButton {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon>${icon}</md-icon>` : '';
  }

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--outlined': true,
    };
  }
}