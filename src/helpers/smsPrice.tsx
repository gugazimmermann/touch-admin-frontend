import axios from 'axios';

const SMS_PRICE = process.env.REACT_APP_SMS_PRICE || 0.02297;

const smsPrice = async () => {
  const { data } = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL');
  const dolar = data.USDBRL.bid;
  const price = (Math.round(((dolar * (+SMS_PRICE)) + Number.EPSILON) * 100) / 100) + 0.02
  return +price.toFixed(2);
}

export default smsPrice;
