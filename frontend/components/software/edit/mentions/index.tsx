// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import EditMentionsProvider from './EditMentionsProvider'
import MentionByType from './MentionByType'
import FindSoftwareMention from './FindSoftwareMention'
import AddMention from './AddMention'
import useSoftwareContext from '../useSoftwareContext'
import ImportSoftwareMentions from './ImportSoftwareMentions'

export default function SoftwareMentions() {
  const {token} = useSession()
  const {software} = useSoftwareContext()

  // console.group('ProjectImpact')
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <EditMentionsProvider token={token} software={software.id}>
      <EditSection className="xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]">
        <div className="pt-4 pb-8">
          <MentionByType software={software.id ?? ''} token={token}/>
        </div>
        <div className="pt-4 pb-8">
          <FindSoftwareMention />
          <ImportSoftwareMentions/>
          <AddMention />
        </div>
      </EditSection>
    </EditMentionsProvider>
  )
}
