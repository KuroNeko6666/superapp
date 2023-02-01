import { AngularEditorConfig } from "@kolkov/angular-editor";

export const EDITOR_CONFIG: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '15rem',
  minHeight: '5rem',
  placeholder: 'Enter text here...',
  translate: 'no',
  defaultParagraphSeparator: 'p',
  defaultFontName: 'Arial',
  toolbarHiddenButtons: [
    ['bold'],
    ],
  customClasses: [
    {
      name: "quote",
      class: "quote",
    },
    {
      name: 'redText',
      class: 'redText '
    },
    {
      name: "titleText",
      class: "titleText",
      tag: "h1",
    },
  ]
};
