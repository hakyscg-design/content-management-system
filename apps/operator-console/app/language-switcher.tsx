import {
  operatorLanguages,
  type OperatorCopy,
  type OperatorLanguage
} from "./i18n.js";

interface LanguageSwitcherProps {
  readonly language: OperatorLanguage;
  readonly text: OperatorCopy["shell"];
}

export function LanguageSwitcher({ language, text }: LanguageSwitcherProps) {
  return (
    <form
      className="language-switcher"
      action="/api/local/language"
      method="post"
      aria-label={text.languageAria}
    >
      <span className="project-label">{text.languageLabel}</span>
      <div className="language-toggle">
        {operatorLanguages.map((option) => (
          <button
            aria-pressed={option.id === language}
            className="language-option"
            key={option.id}
            name="language"
            type="submit"
            value={option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
    </form>
  );
}
