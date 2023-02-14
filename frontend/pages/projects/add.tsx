// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import ProtectedContent from '../../auth/ProtectedContent'
import AppHeader from '~/components/AppHeader'
import PageContainer from '~/components/layout/PageContainer'
import AppFooter from '~/components/AppFooter'

import AddProjectCard from '../../components/projects/add/AddProjectCard'
import UserAgrementModal from '~/components/user/settings/UserAgreementModal'

/**
 * Add new project. This page enables creation of project with 2 fields:
 * title and subtitle. All "action" is stored in AddSoftwareModal
 */
export default function AddSoftware() {
  return (
    <>
      <AppHeader />
      <ProtectedContent>
        <PageContainer className="flex-1 px-4 py-6 lg:py-12">
          <UserAgrementModal />
          <AddProjectCard />
        </PageContainer>
      </ProtectedContent>
      <AppFooter />
    </>
  )
}
