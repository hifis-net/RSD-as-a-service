// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {test, expect} from '@playwright/test'
import {
  createSoftware, editSoftwareInput,
  conceptDoiFeatures,
  importContributors,
  editFirstContact,
  createContact
} from '../helpers/software'
import {mockSoftware} from '../mocks/mockSoftware'
import {getRandomPerson} from '../mocks/mockPerson'
import {
  addOrganisation, openEditPage,
  openEditSection,
  addCitation,
  addRelatedSoftware,
  addRelatedProject
} from '../helpers/utils'
import {mockSoftwareOrganisation, Organisation} from '../mocks/mockOrganisation'
import { mockCitations } from '../mocks/mockCitations'

// run tests in serial mode
// we first need first to create software
test.describe.serial('Software', async()=> {
  test('Create software', async ({page}, {project}) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
    // start from homepage
    await page.goto('/')
    // create software
    const slug = await createSoftware({
      page,
      title: software.title,
      desc: software.desc,
      slug: software.slug
    })
    // expect slug
    expect(slug).toEqual(software.slug)
  })

  test('Add organisations', async ({page}, {project}) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
    const organisations: Organisation[] = mockSoftwareOrganisation[project.name]

    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // navigate to organisations section
    await openEditSection(page,"Organisations")

    // create organisations
    for (const org of organisations) {
      await addOrganisation(page, org, 'software_for_organisation')
    }

    const items = page.getByTestId('organisation-list-item')
    const [count] = await Promise.all([
      items.count(),
      page.waitForLoadState('networkidle')
    ])
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('Edit software info', async ({page}, {project}) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
    // open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // edit software values
    await editSoftwareInput(page, software)

    // test DOI imports
    await conceptDoiFeatures(page, software.doi, software.doiApi)

    // publish the software
    await page.getByLabel('Published').check()

    // find view page button
    const viewPage = page.getByRole('button', {
      name: 'view page'
    })
    // open view page
    await viewPage.click()
  })

  test('Edit contributors', async ({page}, {project}) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
    const contact = getRandomPerson(project.name)

    // open edit software page from software overview
    // somehow the overview does not shows created software in CI?!?
    // await openEditSoftwarePage(page, `Test software ${browserName}`)

    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // navigate to contributors section
    await openEditSection(page,"Contributors")
    // await openEditContributors(page)

    // import contributors
    if (software.doi) {
      await importContributors(page)
    }

    // edit first contributor
    await editFirstContact(page)

    // add new contact
    await createContact(page,contact)
  })

  test("Add mentions", async ({ page }, { project }) => {
    // get mock software for the browser
    const software = mockSoftware[project.name]
    const citations = mockCitations[project.name]

    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // navigate to organisations sectiont
    await openEditSection(page, "Mentions")

    // add mentions using doi
    for (const item of citations.dois.mention) {
      await addCitation(page, item,"mention_for_software")
    }

    // add mentions using title search
    // for (const item of mentions.titles) {
    //   await addMention(page, item)
    // }

  })

  test("Related items", async ({ page }, { project }) => {
    const software = mockSoftware[project.name]

    // directly open edit software page
    const url = `/software/${software.slug}`
    await openEditPage(page, url, software.title)

    // await page.pause()
    // navigate to organisations section
    await openEditSection(page, "Related topics")

    await addRelatedSoftware(page, "software_for_software")

    await addRelatedProject(page, "software_for_project")

  })


})

