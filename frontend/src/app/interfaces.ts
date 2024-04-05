export interface User {
  id?: number
  username?: string
  email: string,
  password: string,
  news: News[]
  roles?: []
}
export interface Category {
  id?: number,
  name: string,
  news: News[]
}

export interface News {
  id?: number,
  name: string,
  author?: User,
  date?: Date,
  text?: string,
  imageSrc?: string
}

export interface Comment {
  id?: number
  news?: News
  date: Date
  text: string,
  user?: User
}

export interface Message {
  id?: number
  text: string
  date?: Date
  user?: User
}
