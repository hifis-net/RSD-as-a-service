// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

import SearchContext from './SearchContext'

export default function Searchbox() {
  const {searchInput,setSearchInput,placeholder,setSearchFor} = useContext(SearchContext)

  return (
    <Input
      id="search-input"
      autoComplete='off'
      placeholder={placeholder}
      value={searchInput}
      sx={{
        flex:1,
        minWidth: ['inherit', '20.5rem', '19.5rem']
      }}
      onChange={({target})=>{
        setSearchInput(target.value)
      }}
      onKeyPress={(event)=>{
        // pass search value on enter
        if (event.key.toLowerCase()==='enter'){
          setSearchFor(searchInput)
        }
      }}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon
            sx={{cursor: 'pointer'}}
            onClick={() => setSearchFor(searchInput)} />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="start">
          {searchInput ?
            <ClearIcon
              sx={{cursor:'pointer'}}
              onClick={()=>{
                setSearchInput('')
              }}
            />
            :null
          }
        </InputAdornment>
      }
    />
  )
}
