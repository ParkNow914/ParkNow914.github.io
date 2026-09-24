// Renderiza as seções sem interação para HTML puro. O React do navegador não
// precisa hidratar nó por nó o que nunca muda: a página longa fica leve no celular.
import { renderToStaticMarkup } from "react-dom/server";
import {
  Applications,
  Colophon,
  Field,
  Install,
  Maker,
  Models,
  Systems,
  Troubleshooting,
  Warranty,
} from "../src/components/Sections";

export function renderAll() {
  return {
    applications: renderToStaticMarkup(<Applications />),
    models: renderToStaticMarkup(<Models />),
    systems: renderToStaticMarkup(<Systems />),
    install: renderToStaticMarkup(<Install />),
    field: renderToStaticMarkup(<Field />),
    maker: renderToStaticMarkup(<Maker />),
    troubleshooting: renderToStaticMarkup(<Troubleshooting />),
    warranty: renderToStaticMarkup(<Warranty />),
    colophon: renderToStaticMarkup(<Colophon />),
  };
}
