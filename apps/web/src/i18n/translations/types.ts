export type Translations = {
  nav: {
    dashboard: string
    energyMeter: string
    appearance: string
    about: string
    settings: string
  }
  appearance: {
    title: string
    description: string
    theme: string
    themeAriaLabel: string
    system: string
    systemAriaLabel: string
    light: string
    lightAriaLabel: string
    dark: string
    darkAriaLabel: string
    language: string
    languageAriaLabel: string
  }
  energyMeter: {
    title: string
    description: string
    status: string
    energyTariff: string
    meterStatus: {
      reset: string
      started: string
      stopped: string
    }
    stats: {
      consumedEnergy: string
      totalCost: string
      avgPower: string
    }
    currentPower: {
      label: string
      subtractBaseline: string
    }
    timer: {
      label: string
      modeAriaLabel: string
      noLimit: string
      withTimer: string
      targetTime: string
    }
    duration: {
      label: string
      units: string
      start: string
      stop: string
      reset: string
    }
    timeUnit: {
      hours: string
      minutes: string
      seconds: string
      increase: string
      decrease: string
    }
  }
  dashboard: {
    common: {
      emptyMessage: string
      editPreferences: string
      copy: string
    }
    energy: {
      title: string
      consumptionToday: string
      avgDailyConsumption: string
      grossPrice: string
      fixedFee: string
      reading: string
      cost: string
      avgMonthlyConsumption: string
      avgMonthlyCost: string
      instantDraw: string
    }
    indoor: {
      title: string
      co2Level: string
      humidity: string
      airQuality: string
      dusk: string
      dawn: string
    }
    temperature: {
      title: string
      bathroomFloor: string
      livingRoom: string
      bedroom: string
      bathroom: string
    }
    weather: {
      title: string
      temperature: string
      uvIndex: string
      humidity: string
      windSpeed: string
      windGusts: string
      sunAltitude: string
      moonAltitude: string
      beaufortScale: readonly [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    }
    weatherForecast: {
      title: string
    }
    hourlyWeatherForecast: {
      title: string
    }
    jobs: {
      title: string
      applied: string
      favourite: string
      restoreOffer: string
      hideOffer: string
      removeFromFavourites: string
      addToFavourites: string
      markAsApplied: string
    }
    news: {
      title: string
      markAsUnread: string
      markAsRead: string
    }
    stockMarket: {
      title: string
      symbol: string
      earnings: string
      priceTarget: string
      peAtTarget: string
      quote: string
      status: {
        afterHours: string
        preMarket: string
        closed: string
        open: string
      }
      openingIn: string
      closingIn: string
      durationHourSuffix: string
    }
    torrents: {
      title: string
      search: string
      showAll: string
      searchTorrents: string
      clearSearch: string
      download: string
      searchFor: string
    }
  }
}
