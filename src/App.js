import React from 'react'
import Page1 from './component/Page1'
export default function App() {
  const items = ['FICTION', 'DRAMA', 'HUMOR', 'POLITICS', 'PHILOSOPHY', 'HISTORY', 'ADVENTURE'];
  return (
    <MyContext.Provider value={items} >
      <Page1 />
    </MyContext.Provider>
  )
}
export const MyContext = React.createContext();



