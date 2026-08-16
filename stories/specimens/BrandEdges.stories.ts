/* Edges and radii.

   Three values and each has a job: 0 is structural — a section rule, a table
   line — 4 is anything you touch, and 6 is the container around it. A control
   and its container must not share a corner, which is the whole reason the
   two differ by one step.

   The samples are drawn from tokens, so a radius that moves in the system
   moves in the picture of it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The card, as it is drawn. */
const CARD = `<div class="spec">
  <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
    <button style="font-family:var(--font-sans); font-size:14px; font-weight:600; color:var(--text-on-accent); background:var(--accent); border:none; border-radius:var(--radius-control); padding:8px 15px; cursor:pointer;">Install the server</button>
    <button style="font-family:var(--font-sans); font-size:14px; font-weight:600; color:var(--text-primary); background:transparent; border:1px solid var(--border-strong); border-radius:var(--radius-control); padding:7px 14px; cursor:pointer; white-space:nowrap;">Read the tool surface</button>
    <span style="font-family:var(--font-mono); font-size:13px; color:var(--text-on-accent); background:var(--accent); border-radius:var(--radius-control); padding:5px 11px;">overview</span>
    <span style="font-family:var(--font-mono); font-size:13px; color:var(--text-secondary); padding:5px 11px;">tools</span>
    <span class="spec-cap">--radius-control · 4px</span>
  </div>
  <div style="display:flex; gap:14px; align-items:stretch;">
    <div style="flex:1; border:1px solid var(--border-subtle); background:var(--surface-raised); padding:13px 15px; border-radius:var(--radius-card);">
      <div class="sds-note__title">Card</div>
      <div class="spec-cap" style="margin-top:6px;">--radius-card · 6px</div>
    </div>
    <div style="flex:1; border:1px solid var(--border-strong); background:var(--surface-sunken); padding:11px 13px; border-radius:var(--radius-control); font-family:var(--font-mono); font-size:13px; color:var(--text-muted);">
      13.4<span style="color:var(--accent);">|</span>
      <div class="spec-cap" style="margin-top:7px;">--radius-control · 4px</div>
    </div>
    <div style="flex:1; border-top:1px solid var(--border-subtle); border-bottom:1px solid var(--border-subtle); padding:11px 0; border-radius:var(--radius-none);">
      <div class="sds-note__title">Section rules, tables</div>
      <div class="spec-cap" style="margin-top:6px;">--radius-none · 0px</div>
    </div>
  </div>
</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Edges & radii',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-edges.card.html',
      group: 'Brand',
      name: 'Edges & radii',
      subtitle: '0px is structural, 4px is anything you touch, 6px is the container around it',
      viewport: '700x172',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string => CARD;

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
