'use babel';

import Geometry from './geometry';

export default class PaneMeasure {
  static getPaneRect(pane) {
    const elem = atom.views.getView(pane);
    return elem.getBoundingClientRect();
  }

  static getCursorPosition_(pane) {
    const editor = pane.getActiveEditor();
    if (!editor) {
      return null;
    }

    const cursor = editor.getCursors()[0];
    const elem = editor.getElement();
    const editorRect = editor.getElement().getBoundingClientRect();
    const scrollLeft = elem.getScrollLeft();
    const scrollTop = elem.getScrollTop();
    const cursorRect = elem.pixelRectForScreenRange(cursor.getScreenRange());
    const cursorCenter = Geometry.getRectCenter(cursorRect);
    return {
      x: editorRect.left - scrollLeft + cursorCenter.x,
      y: editorRect.top - scrollTop + cursorCenter.y,
    };
  }

  static getFocusPosition(pane) {
    const cursorPos = PaneMeasure.getCursorPosition_(pane);
    if (cursorPos !== null) {
      return cursorPos;
    }

    const paneRect = PaneMeasure.getPaneRect(pane);
    return Geometry.getRectCenter(paneRect);
  }
};
