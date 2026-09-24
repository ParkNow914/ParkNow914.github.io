"use client";

import { useEffect, useId, useState } from "react";
import { SIZING, wa } from "@/content/site";
import { origem } from "@/lib/origin";
import { Icon } from "./Icon";
import { Folio, LegacyAnchors, SectionHead } from "./Manual";

const brl = (n: number) => "R$ " + Math.round(n).toLocaleString("pt-BR");

function Scale({
  label,
  value,
  min,
  max,
  step,
  unit,
  prefix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  const ticks = Math.round((max - min) / step);
  return (
    <div className="scale">
      <label className="scale__label" htmlFor={id}>
        {label}
      </label>
      <output className="scale__val" htmlFor={id}>
        {prefix ? <span className="scale__unit">{prefix}</span> : null}
        {value}
        {unit ? <span className="scale__unit">{unit}</span> : null}
      </output>
      <div className="scale__track" style={{ "--pct": `${pct}%`, "--ticks": ticks } as React.CSSProperties}>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      <div className="scale__ends" aria-hidden="true">
        <span>
          {prefix}
          {min}
          {unit}
        </span>
        <span>
          {prefix}
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

export function Sizing() {
  const [hours, setHours] = useState(4);
  const [people, setPeople] = useState(2);
  const [wage, setWage] = useState(25);
  const [mark, setMark] = useState("");

  useEffect(() => setMark(origem()), []);

  const monthlyHours = hours * people * 22;
  const monthlySave = monthlyHours * wage * 0.7;
  const yearSave = monthlySave * 12;
  const hoursBack = Math.round(monthlyHours * 12 * 0.7);

  const href = wa(
    `Olá Alisson! Usei a calculadora do seu site e vi que posso economizar cerca de ${brl(yearSave)}/ano automatizando. Quero conversar sobre isso.${mark}`,
  );

  return (
    <section className="sec" id="dimensionamento" data-section="dimensionamento" aria-labelledby="h-dimensionamento">
      <LegacyAnchors section="dimensionamento" />
      <SectionHead id="h-dimensionamento" address="§6" title="Quanto o trabalho manual custa" lede={SIZING.intro} />
      <div className="sizing">
        <div className="sizing__scales">
          <Scale label="Horas por dia em atendimento e tarefa repetitiva" value={hours} min={1} max={12} step={1} unit=" h" onChange={setHours} />
          <Scale label="Pessoas fazendo esse trabalho" value={people} min={1} max={10} step={1} onChange={setPeople} />
          <Scale label="Custo por hora dessa pessoa" value={wage} min={10} max={100} step={5} prefix="R$ " onChange={setWage} />
        </div>
        <div className="readout" aria-live="polite">
          <p className="readout__k">Economia estimada por ano</p>
          <p className="readout__v">{brl(yearSave)}</p>
          <dl className="readout__rows">
            <div>
              <dt>Por mês</dt>
              <dd>{brl(monthlySave)}</dd>
            </div>
            <div>
              <dt>Horas devolvidas por ano</dt>
              <dd>{hoursBack.toLocaleString("pt-BR")} h</dd>
            </div>
          </dl>
          <a className="btn btn--signal" href={href} target="_blank" rel="noopener">
            <Icon name="whatsapp" size={18} />
            Quero automatizar isso
          </a>
        </div>
      </div>
      <p className="sizing__note">{SIZING.note}</p>
      <Folio id="dimensionamento" />
    </section>
  );
}
