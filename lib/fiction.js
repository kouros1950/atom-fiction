'use babel';

import FictionView from './fiction-view';
import { CompositeDisposable } from 'atom';

export default {

  fictionView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.fictionView = new FictionView(state.fictionViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.fictionView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fiction:toggle': () => this.toggle()
    }));

    var addDisposable = (editor, disposable) => {

    };

    this.subscriptions.add(atom.workspace.observeTextEditors((editor) => {
      if (editor) {
        this.updateCount();
        this.subscriptions.add(editor.onDidChange(() => {
          this.updateCount();
        }));
      } else {
        this.updateCount(0);
      }
    }));

    this.subscriptions.add(atom.workspace.onDidChangeActiveTextEditor((editor) => {
      if (!editor) {
        this.updateCount(0);
      }
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.fictionView.destroy();
    this.statusBarTile.destroy();
  },

  serialize() {
    return {
      fictionViewState: this.fictionView.serialize()
    };
  },

  toggle() {
    console.log('Fiction was toggled!');
    this.updateCount();
  },

  updateCount(count) {
    // console.log('updateCount');
    if (count !== undefined) {
      this.fictionView.setCount(0);
    } else {
      var editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        var text = editor.getText().replace(/[\s\n]/g, '').length;
        this.fictionView.setCount(text);
      }
    }
  },

  consumeStatusBar(statusBar) {
    this.statusBarTile = statusBar.addRightTile({ item: this.fictionView, priority: 0 });
  }

};
