class MoneyUtils {
  static thousands(value) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })
  }
}

export default MoneyUtils;