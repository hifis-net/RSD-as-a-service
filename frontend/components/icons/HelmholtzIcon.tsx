// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: EUPL-1.2

import {DefaultComponentProps, OverridableTypeMap} from '@mui/material/OverridableComponent'
import SvgIcon from '@mui/material/SvgIcon'
import HelmholtzIconSVG from './helmholtz_icon.svg'

export const HelmholtzIcon = (props: DefaultComponentProps<OverridableTypeMap>) => (
    <SvgIcon {...props} component={HelmholtzIconSVG} inheritViewBox />
)

