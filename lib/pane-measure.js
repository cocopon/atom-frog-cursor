'use babel';

import Geometry from './geometry';

export default class PaneMeasure {
  static getPaneRect(pane) {
    const elem = atom.views.getView(pane);
    return elem.getBoundingClientRect();
  }

  static getCursorPoint_(pane) {
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

  static getFocusPoint(pane) {
    const cursorPt = PaneMeasure.getCursorPoint_(pane);
    if (cursorPt !== null) {
      return cursorPt;
    }

    const paneRect = PaneMeasure.getPaneRect(pane);
    return Geometry.getRectCenter(paneRect);
  }

  static getScreenPositionForGlobalPoint(pane, globalPoint) {
    const editor = pane.getActiveEditor();
    if (!editor) {
      return null;
    }

    const elem = editor.getElement();
    const editorRect = elem.getBoundingClientRect();
    const pixelPos = {
      left: globalPoint.x - editorRect.left + elem.getScrollLeft(),
      top: globalPoint.y - editorRect.top + elem.getScrollTop(),
    };
    return elem.screenPositionForPixelPosition(pixelPos);
  }
};
