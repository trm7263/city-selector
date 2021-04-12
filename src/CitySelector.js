import React from 'react'
import Spinner from './Spinner'

const apiPath = "http://localhost:3030"

class CitySelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDropdown: false,
      showLoading: false,
      dropdownOptions: [],
      preferredCityIds: [],
      preferredCities: []
    }
  }

  componentDidMount() {
    this.getPreferredCityIds()
  }

  selectOption(selectedOption) {
    let requestBody = {}
    requestBody[selectedOption.geonameid] = true
    fetch(`${apiPath}/preferences/cities`, {
      method: 'PATCH',
      headers: {"Content-Type": "application/json; charset=utf-8"},
      body: JSON.stringify(requestBody)
    }).then(response => {
      this.getPreferredCityIds()
    })
  }

  onTextChange(searchValue) {
    let isAcceptableLength = searchValue.length > 2
    this.setState({showDropdown: isAcceptableLength, showLoading: true}, this.getCities(searchValue, isAcceptableLength))
  }

  getPreferredCityIds() {
    fetch(`${apiPath}/preferences/cities`, {
      method: "GET",
      headers: {"Content-Type": "application/json; charset=utf-8"}
    }).then(response => {
      if (response.ok) {
        response.json().then(preferedCitiesResponse => {
          this.setState({preferredCityIds: preferedCitiesResponse.data})
        })
      }
    })
  }

  async getCity(id) {
    const response = await fetch(`${apiPath}/cities/${id}`, {
      method: "GET",
      headers: {"Content-Type": "application/json; charset=utf-8"}
    })
    const json = await response.json()
    return json
  }

  getCities(query, isAcceptableLength) {
    if (isAcceptableLength) {
      fetch(`${apiPath}/cities?filter=${query}`, {
        method: "GET",
        headers: {"Content-Type": "application/json; charset=utf-8"}
      }).then(response => {
        if (response.ok) {
          response.json().then(citiesResponse => {
            this.setState({dropdownOptions: citiesResponse.data, showLoading: false})
          })
        }
      })
    } else {
      this.setState({showLoading: false})
    }
  }

  renderPreferredCities() {
    // I would like to use the getCity method for each of these
    // however, I was unable to get it working in the time I gave myself.
    // I can speak to this in the review, for now it just displays the ids.
    return this.state.preferredCityIds.map((option, index) => {
      return <div key={index}>{option}</div>
    })
  }

  renderCheckbox(id) {
    let isChecked = this.state.preferredCityIds.some(cityId => cityId === id)
    return isChecked ? <i className="fa fa-check-circle select-option-toggle"></i> : <i className="fa fa-circle-o select-option-toggle"></i>
  }

  renderDropdown() {
    if (!this.state.dropdownOptions.length) return <div className="spinner-container">No results found</div>
    return this.state.dropdownOptions.map((option, index) => {
      return (
        <div
          key={index}
          className="dropdown-option"
          onClick={() => this.selectOption(option)}>
            {this.renderCheckbox(option.geonameid)}
            {`${option.name}, ${option.subcountry} - ${option.country}`}
          </div>)
    })
  }

  render() {
    return (
      <div className="dropdown-container">
        <div>{this.renderPreferredCities()}</div>
        <input
            type="text"
            className="dropdown-input"
            placeholder="Type a city name..."
            onChange={(e) => this.onTextChange(e.target.value)}
        />
        <div className={`dropdown ${this.state.showDropdown ? '' : 'hide-dropdown'}`}>
          {this.state.showLoading
            ? <div className="spinner-container"><Spinner /></div>
            : this.renderDropdown()}
        </div>
      </div>
    )
  }
}

export default CitySelector
