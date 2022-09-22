import _m from 'moment';

const formatData = (dateTime) => {
  return _m(dateTime).fromNow().split(' ')[0] > 24
    ? _m(dateTime).format('MMM Do YY')
    : _m(dateTime).fromNow();
};

export default formatData;
