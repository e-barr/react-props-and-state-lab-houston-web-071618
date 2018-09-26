import React from 'react'

import Filters from './Filters'
import PetBrowser from './PetBrowser'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      pets: [],
      filters: {
        type: 'all'
      },
      filteredPets: []
    }

    fetch('/api/pets')
      .then(resp => resp.json())
      .then(resp => this.setState({pets: resp}))
  }

  onChangeType = event => {
    const newType = event.target.value
    this.setState({filters: {...this.state.filters, type: newType}})
  }

  onFindPetsClick = () => {

    const petType = this.state.filters.type
    let selectedUrl

    if (petType === 'all') {
      selectedUrl = '/api/pets'
      this.setState({filteredPets: this.state.pets})
    } else {
      selectedUrl = `/api/pets?type=${petType}`
      const newFiltered = this.state.pets.filter(pet => pet.type === petType)
      this.setState({filteredPets: newFiltered})
    }

    fetch(selectedUrl)
      .then(resp => resp.json())
  }

  onAdoptPet = id => {
    const updatedPets = this.state.pets.map(onePet => {
      if (onePet.id === id) {
        return {...onePet, isAdopted: true}
      } else {
        return {...onePet}
      }
    })

    this.setState({pets: updatedPets})

    if (this.state.filters.type === 'all') {
      this.setState({filteredPets: updatedPets})
    } else {
      let newFiltered = updatedPets.filter(pet => pet.type === this.state.filters.type)
      this.setState({filteredPets: newFiltered})
    }
  }

  render() {
    return (
      <div className="ui container">
        <header>
          <h1 className="ui dividing header">React Animal Shelter</h1>
        </header>
        <div className="ui container">
          <div className="ui grid">
            <div className="four wide column">
              <Filters onChangeType={this.onChangeType} onFindPetsClick={this.onFindPetsClick}/>
            </div>
            <div className="twelve wide column">
              {this.state.pets.length > 0 ? <PetBrowser pets={this.state.filteredPets} onAdoptPet={this.onAdoptPet}/> : <p>Select your pets</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
