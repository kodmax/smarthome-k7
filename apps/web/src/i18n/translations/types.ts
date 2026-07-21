export type Translations = {
  nav: {
    dashboard: string
    jobMarket: string
    stockMarket: string
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
  stockMarket: {
    title: string
    description: string
    marketStatus: {
      title: string
    }
    earningsTomorrow: {
      title: string
    }
    highUpside: {
      title: string
    }
    lowForwardPE: {
      title: string
    }
    earningsSoon: {
      title: string
    }
    priceTargetChange: {
      title: string
    }
    quotesOverview: {
      title: string
    }
    views: {
      label: string
    }
  }
  stockQuotes: {
    title: string
  }
  jobMarket: {
    title: string
    description: string
    summary: {
      activeOffers: string
      newOffers: string
      medianSalary: string
      offersWithSalaryRange: string
      workModeSplit: string
      permanentEmployment: string
      vsPreviousPeriod: string
    }
    salaryDistribution: {
      title: string
      brackets: {
        below5k: string
        from5to10k: string
        from10to15k: string
        from15to20k: string
        from20to25k: string
        from25to30k: string
        from30to35k: string
        from35to40k: string
        above40k: string
      }
    }
    popularTechnologies: {
      title: string
      columns: {
        rank: string
        technology: string
        offers: string
        share: string
        median: string
      }
    }
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
    title: string
    description: string
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
      removeFromFavourites: string
      addToFavourites: string
      markAsApplied: string
      editApplication: string
      company: string
      currentApplicationStatus: string
      applicationDate: string
      lastStatusChange: string
      changeApplicationStatus: string
      newApplicationStatus: string
      applicationComment: string
      save: string
      cancel: string
      filters: {
        label: string
        new: string
        inProgress: string
        notInterested: string
        finished: string
      }
      workplaceType: {
        office: string
        remote: string
        hybrid: string
      }
      applyStatus: {
        'not-applied': string
        applied: string
        'not-interested': string
        'unmet-requirements': string
        rejected: string
        'no-response': string
        interview: string
        offer: string
        'offer-accepted': string
        withdrawn: string
      }
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
      pe: string
      toPriceTarget: string
      priceTarget: string
      peAtTarget: string
      quote: string
      change: string
      priceTargetChange: string
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
    weekdayLong: readonly [string, string, string, string, string, string, string]
  }
  offline: {
    title: string
    description: string
    retry: string
  }
}
