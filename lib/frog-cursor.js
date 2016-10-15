'use babel';

import {CompositeDisposable} from 'atom';
import Config from './config';
import PaneMeasure from './pane-measure';
import PaneUtil from './pane-util';
import Geometry from './geometry';

export default {
  subscriptions: null,
  config: Config,

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'frog-cursor:jump-to-above': () => this.jumpTo_('above'),
      'frog-cursor:jump-to-below': () => this.jumpTo_('below'),
      'frog-cursor:jump-to-left':  () => this.jumpTo_('left'),
      'frog-cursor:jump-to-right': () => this.jumpTo_('right'),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  isInVimInsertMode_() {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return false;
    }

    const elem = editor.getElement();
    return elem.classList.contains('vim-mode') &&
      elem.classList.contains('insert-mode');
  },

  jumpTo_(direction) {
    if (atom.config.get('frog-cursor.considersVimMode.enabled')
        && this.isInVimInsertMode_()) {
      // Block switching pane in insert-mode of `vim-mode`
      return;
    }

    const panes = atom.workspace.getPanes();
    const paneRects = panes.map(PaneMeasure.getPaneRect);

    const activePane = atom.workspace.getActivePane();
    const focusPt = PaneMeasure.getFocusPoint(activePane);

    const nextPaneIndex = Geometry.getNextRectIndex(paneRects, focusPt, direction);
    if (nextPaneIndex >= 0) {
      const nextPane = panes[nextPaneIndex];

      if (atom.config.get('frog-cursor.adjustsRowInHorizontalJump') &&
          Geometry.isDirectionHorizontal(direction)) {
        const screenPos = PaneMeasure.getScreenPositionForGlobalPoint(nextPane, focusPt);
        PaneUtil.selectPosition(nextPane, screenPos);
      }

      nextPane.focus();
    }
    else if (atom.config.get('frog-cursor.movesCursorInside')) {
      PaneUtil.moveCursorTo(
        activePane, direction,
        atom.config.get('frog-cursor.movesCursorInside.force')
      );
    }
  },
};
