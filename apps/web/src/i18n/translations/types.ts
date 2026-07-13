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
    hintExplanations: {
      energyHighDraw: { line1: string }
      hotBedroom: { line1: string }
      strongWind: { line1: string }
      hotOutdoor: { line1: string }
      highUv: { line1: string }
      frost: { line1: string }
      hourlyRain: { line1: string }
      hourlySnow: { line1: string }
      hourlyHail: { line1: string }
      hourlySleet: { line1: string }
      hourlyIce: { line1: string }
      hourlyMixed: { line1: string }
      hourlyHotOutdoor: { line1: string }
      hourlyStrongWind: { line1: string }
      hourlyHighUv: { line1: string }
      hourlyFrost: { line1: string }
      ventilate: {
        highCo2: string
        elevatedCo2: string
        highHumidity: string
      }
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
      highDraw: string
    }
    indoor: {
      title: string
      co2Level: string
      humidity: string
      airQuality: string
      dusk: string
      dawn: string
      ventilate: {
        highCo2: string
        elevatedCo2: string
        highHumidity: string
        tooCold: string
        tooHot: string
        poorOutdoorAir: string
        tooWindy: string
        comfortable: string
        missingData: string
      }
    }
    temperature: {
      title: string
      bathroomFloor: string
      livingRoom: string
      bedroom: string
      bathroom: string
      hotBedroom: string
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
      strongWind: string
      hotOutdoor: string
      highUv: string
      frost: string
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
      rainChance: string
      snowChance: string
      hailChance: string
      sleetChance: string
      iceChance: string
      mixedChance: string
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
  dateTime: {
    todayShort: string
    tomorrowShort: string
    weekdayShort: readonly [string, string, string, string, string, string, string]
  }
}
