// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Citation file formats supported by RSD
 * These items are used by
 */
export const citationFormats = [
  {label:'BibTex',format:'bibtex',contentType:'application/x-bibtex',ext:'bib'},
  {label:'EndNote',format:'endnote',contentType:'text/plain',ext:'enw'},
  {label:'RIS',format:'ris',contentType:'application/x-research-info-systems',ext:'ris'},
  {label:'CodeMeta',format:'codemeta',contentType:'application/json',ext:'json'},
  {label:'Citation File Format',format:'cff',contentType:'text/yaml',ext:'cff'}
]

export type CitationFormatType = typeof citationFormats[0]
