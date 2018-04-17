/**
 *
 */
exports.formatNames = () => {
  return (colName) => {
    if (typeof colName === 'string') {
      let currencySympbols = ['inr', 'usd', 'btc'];
      const words = colName.split('_');
      for (let i = 0; i < words.length; i++) {
        if (currencySympbols.indexOf(words[i]) > -1 ) {
          words[i] = words[i].toUpperCase();
        } else {
          words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
      }
      return words.join(' ');
    }
    return colName;
  };
};

exports.upDownOrStable = () => {
  return (key, data) => {
    let changeBGForKeys = ['percent_change_1h', 'percent_change_24h',
                           'percent_change_7d'];
    if (changeBGForKeys.indexOf(key) > -1) {
      data = parseFloat(data);
      if (data > 0.0) {
        return 'up';
      } else if (data == 0.0) {
        return 'stable';
      }
      return 'down';
    }
    return 'stable';
  };
};

exports.convertToPreferredCurrency = () => {
  return (price, currencyConversionRate) => {
    return price * currencyConversionRate;
  };
};
