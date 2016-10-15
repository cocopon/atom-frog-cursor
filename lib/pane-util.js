'use babel';

import Geometry from './geometry';

export default class PaneUtil {
  static moveCursorTo(pane, direction, force = 0.5) {
    const editor = pane.getActiveEditor();
    if (!editor || editor.hasMultipleCursors()) {
      return;
    }

    const cursor = editor.getCursors()[0];
    const offsetRows = Math.floor(editor.getRowsPerPage() * force);
    switch (direction) {
      case Geometry.DIRECTION.BELOW:
        cursor.moveDown(offsetRows);
        break;
      case Geometry.DIRECTION.ABOVE:
        cursor.moveUp(offsetRows);
        break;
    }
  }

  static selectPosition(pane, position) {
    const editor = pane.getActiveEditor();
    if (!editor) {
      return;
    }

    const cursor = editor.getCursors()[0];
    cursor.setScreenPosition(position);
  }
}
