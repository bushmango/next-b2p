export interface IField {
  label: string
  field: string
  width?: number
  readonly?: boolean
}
export let fields: IField[] = [
  { label: 'Mailing Name', field: 'FullName', width: 250 },
  { label: 'Preferred Name', field: 'Aka', width: 250 },
  { label: 'Notes', field: 'Notes' },
  { label: 'ID #', field: 'Id' },
  { label: 'Institution', field: 'Institution', width: 250 },
  { label: 'Address', field: 'Address', width: 250 },
  { label: 'Unit', field: 'Unit' },
  { label: 'City', field: 'City' },
  { label: 'State', field: 'State' },
  { label: 'Zip', field: 'Zip' },
  // { label: 'Guid', field: 'Guid', width: 150, readonly: true },
]

export let fields2: IField[] = [
  { label: 'Title', field: 'Title', width: 150 },
  { label: 'Author', field: 'Author', width: 150 },
  { label: 'Price', field: 'Price', width: 150 },
]
