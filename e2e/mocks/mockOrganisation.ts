
export type Organisation = {
  name: string
  logo?:string
}

export const mockSoftwareOrganisation = {
  chrome: [{
      name: 'Netherlands eScience Center',
      logo: 'images/nlescience.png'
    },{
      name: 'Dutch Research Council',
      logo: 'images/nwo-logo.svg'
    }],
  chromium: [{
      name: 'Vrije Universiteit Amsterdam',
      logo: 'images/vu-logo.svg'
    },{
      name: 'Delft University of Technology',
      logo: 'images/tu-delft-logo.jpg'
  }],
  firefox: [{
      name: 'Massachusetts Institute of Technology',
      logo: 'images/mit-logo.png'
    },{
      name: 'GBS Leiden',
      logo: 'images/gbs-leiden-logo.png'
    }
  ],
  msedge: [{
      name: 'Gemeente Leiden'
    },{
      name: 'Gemeente Den Haag'
  }],
  webkit: [{
      name: 'Erasmus University Rotterdam',
      logo: 'images/erasmus_logo.png'
    },{
      name: 'GGD Rotterdam-Rijnmond'
  }]
}
// we need to use different organisations
// to avoid collision of two proceses
// creating new organisation at the same time
export const mockProjectOrganisation = {
  chromium: [{
    name: 'Netherlands eScience Center',
    logo: 'images/nlescience.png'
  }, {
    name: 'Dutch Research Council',
    logo: 'images/nwo-logo.svg'
  }],
  chrome: [{
    name: 'Vrije Universiteit Amsterdam',
    logo: 'images/vu-logo.svg'
  }, {
    name: 'Delft University of Technology',
    logo: 'images/tu-delft-logo.jpg'
  }],
  msedge: [{
    name: 'Massachusetts Institute of Technology',
    logo: 'images/mit-logo.png'
  }, {
    name: 'GBS Leiden',
    logo: 'images/gbs-leiden-logo.png'
  }
  ],
  firefox: [{
    name: 'Gemeente Leiden'
  }, {
    name: 'Gemeente Den Haag'
  }],
  webkit: [{
    name: 'Philips'
  }, {
    name: 'Microsoft'
  }]
}

export const fundingOrganisation = {
  chrome: [
    'Netherlands eScience Center',
    'Dutch Research Council'
  ],
  chromium: [
    'Vrije Universiteit Amsterdam',
    'Delft University of Technology'
  ],
  firefox: [
    'University of Twente',
    'Leiden University'
  ],
  msedge: [
    'Gemeente Leiden',
    'Gemeente Den Haag'
  ],
  webkit: [
    'Erasmus University Rotterdam',
    'GGD Rotterdam-Rijnmond'
  ]
}
