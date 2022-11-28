// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {expect, Page} from '@playwright/test'
import {Person} from '../mocks/mockPerson'
import {MockedProject} from '../mocks/mockProject'
import {CreateSoftwareProps} from '../mocks/mockSoftware'
import {fillAutosaveInput, uploadFile} from './utils'

export async function createProject({title, desc, slug, page}: CreateSoftwareProps) {
  // get add menu item
  const addMenu = page.getByTestId('add-menu-button')
  const newProject = page.getByRole('menuitem', {
    name: 'New Project'
  })
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })

  // click on add button
  await addMenu.click()
  // click new project
  await Promise.all([
    page.waitForNavigation(),
    newProject.click()
  ])

  // fill in the form
  await Promise.all([
    // fill in title
    page.locator('#Title').fill(title),
    // wait for response on slug validation
    page.waitForResponse(`http://localhost/api/v1/project?select=id,slug&slug=eq.${slug}`)
  ])

  // add subtitle
  await page.getByLabel('Subtitle').fill(desc)

  // get slug
  const inputSlug = await page.getByLabel('The url of this project will be').inputValue()
  const url = `http://localhost/projects/${inputSlug}/edit`

  // click save button
  await Promise.all([
    page.waitForNavigation({
      url,
      waitUntil: 'networkidle'
    }),
    saveBtn.click()
  ])
  // return slug
  return inputSlug
}

export async function editProjectInput(page: Page, mockProject: MockedProject) {
  // image caption if provided
  if (mockProject?.image?.caption) {
    const caption = page.getByPlaceholder('Image caption')
    await fillAutosaveInput({
      page,
      element: caption,
      value: mockProject.image?.caption
    })
  }
  // markdown
  const markdown = page.locator('#markdown-textarea')
  await fillAutosaveInput({
    page,
    element: markdown,
    value: mockProject.markdown
  })
  // start date
  const startDate = page.getByLabel('Start date')
  await fillAutosaveInput({
    page,
    element: startDate,
    value: mockProject.startDate
  })
  // end date
  const endDate = page.getByLabel('End date')
  await fillAutosaveInput({
    page,
    element: endDate,
    value: mockProject.endDate
  })
  // grant id
  const grantId = page.getByLabel('Grant ID')
  await fillAutosaveInput({
    page,
    element: grantId,
    value: mockProject.grantId
  })
}

export async function addFundingOrganisation(page: Page, organisation: string) {
  const fundingInput = page.getByLabel('Find funding organisation')

  await Promise.all([
    fundingInput.fill(organisation),
    // wait untill options list is shown
    page.waitForSelector('#async-autocomplete-listbox')
  ])
  // select organisation option
  const option = page.getByRole('option', {
    name: organisation
  })
  await Promise.all([
    // select item
    option.click(),
    // wait for api update
    page.waitForRequest(/\/project_for_organisation/),
  ])
}

export async function createProjectLink(page: Page, {label, url}: { label: string, url: string }) {
  // reference btn
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })
  // press add button
  await page.getByRole('button', {
    name: 'Add'
  }).nth(1).click()

  // add link label in the modal
  await page.getByRole('dialog', {
    name: 'Project link'
  }).locator('#title').fill(label)

  // add url
  await page.getByLabel('Url').fill(url)

  // save link
  await Promise.all([
    // click on save
    saveBtn.click(),
    // it should make request to /url_for_project
    page.waitForResponse(/\/url_for_project/)
  ])
}

export async function addResearchDomain(page) {
  // select add button
  const addBtn = page.getByTestId('add-research-domains')
  // set brakpoint
  await page.pause()
  // select first level
  await Promise.all([
    page.waitForSelector('[data-testid="select-l1-domain-item"]'),
    page.getByRole('button', {
      name: 'Level 1'
    }).click()
  ])
  await page.getByRole('option', {
    name: 'Life Sciences'
  }).click()
  // select second level
  await Promise.all([
    page.waitForSelector('[data-testid="select-l2-domain-item"]'),
    page.getByRole('button', {
      name: 'Level 2'
    }).click()
  ])
  await page.getByRole('option', {
    name: 'Immunity, Infection and Immunotherapy'
  }).click()
  // select third level
  await Promise.all([
    page.waitForSelector('[data-testid="select-l3-domain-item"]'),
    page.getByRole('button', {
      name: 'Level 3'
    }).click()
  ])
  await page.getByRole('option', {
    name: 'Innate immunity'
  }).click()
  // add selected domains
  await Promise.all([
    addBtn.click(),
    page.waitForResponse(/\/research_domain_for_project/),
    page.waitForSelector('[data-testid="research-domain-chip"]')
  ])
  // validate at least 3 or more research domains
  const chips = page.getByTestId('research-domain-chip')
  expect(await chips.count()).toBeGreaterThanOrEqual(3)

}

export async function addKeyword(page: Page, keyword: string) {
  const keywordInput = page.locator('#async-autocomplete').nth(1)
  // wait for finding
  await Promise.all([
    keywordInput.type(keyword),
    // wait untill options list is shown
    page.waitForSelector('#async-autocomplete-listbox')
  ])
  // select first options
  const option = page.getByRole('option', {
    name: keyword
  })
  await Promise.all([
    option.first().click(),
    page.waitForResponse(/\/keyword_for_project/)
  ])
}

export async function openProjectPage(page: Page, name: string) {
  // open edit project page
  const url = '/projects'
  // naviagate to software overview
  await page.goto(url)

  // select software
  const projectCard = await page.getByRole('link', {
    name
  })

  // open software view
  await Promise.all([
    page.waitForNavigation(),
    // take first in case more than one created
    projectCard.first().click()
  ])

  return true
}

export async function openEditProjectPage(page:Page, name:string) {
  // navigate first to software page
  await openProjectPage(page, name)
  // open edit software
  const editButton = page.getByTestId('edit-button')
  await Promise.all([
    page.waitForNavigation(),
    editButton.click()
  ])
}

export async function openEditTeamPage(page: Page) {
  // open edit team members section
  await page.getByRole('button', {
    name: 'Team Required information'
  }).click()
}

export async function createTeamMember(page, contact: Person) {
  const findContributor = page.getByLabel('Find or add team member')
  // search for contact
  await Promise.all([
    page.waitForResponse(RegExp(contact.apiUrl)),
    findContributor.fill(contact.name)
  ])
  // set breakpoint
  // await page.pause()
  // select add new person option
  await Promise.all([
    page.waitForSelector('[role="dialog"]'),
    page.getByRole('option', {
      name: `Add "${contact.name}"`
    }).click()
  ])
  // upload avatar
  await uploadFile(
    page, '#upload-avatar-image',
    contact.avatar, `[alt="${contact.name}"]`
  )
  // add email
  await page.getByLabel('Email').fill(contact.email)
  // add role
  await page.getByLabel('Role').fill(contact.role)
  // add affiliation
  await page.getByLabel('Affiliation').fill(contact.affiliation)
  // save new contact
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })
  await Promise.all([
    page.waitForResponse(/team_member/),
    page.waitForSelector('[role="dialog"]', {
      state: 'hidden'
    }),
    saveBtn.click()
  ])
  // validate last item - the one we just created
  const members = page.getByTestId('team-member-item')
  // validate contact person flag
  const member = await members.last().textContent()
  // validate name
  expect(member).toContain(contact.name)
  // validate role
  expect(member).toContain(contact.role)
  // validate affiliation
  expect(member).toContain(contact.affiliation)
}

export async function importTeamMemberByOrcid(page: Page, contact: Person) {
  const findContributor = page.getByLabel('Find or add team member')
  // search for contact
  await Promise.all([
    page.waitForResponse(RegExp(contact.apiUrl)),
    findContributor.fill(contact.orcid)
  ])
  // set breakpoint
  // await page.pause()
  // select add new person option
  await Promise.all([
    page.waitForSelector('[role="dialog"]'),
    page.getByRole('option').first().click()
  ])
  // save imported contact
  const saveBtn = page.getByRole('button', {
    name: 'Save'
  })
  await Promise.all([
    page.waitForResponse(/team_member/),
    page.waitForSelector('[role="dialog"]', {
      state: 'hidden'
    }),
    saveBtn.click()
  ])
  // validate last item - the one we just created
  const members = page.getByTestId('team-member-item')
  // validate contact person primary text
  const member = await members.last()
    .locator('.MuiListItemText-primary')
    .textContent()
  // validate name
  // console.log('member...',member)
  expect(member).toContain(contact.name)
}