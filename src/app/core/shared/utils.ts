const PORT_MIN_VALUE = 0;
const PORT_MAX_VALUE = 65536;
const IP_PROTOCOL_MIN_VALUE = 1;
const IP_PROTOCOL_MAX_VALUE = 255;

export function isValidProtocol(protocol: string) {
  try {
    if (protocol === 'ip' || protocol === 'any') {
      return true;
    }

    let isValid = true;
    const protocolNumber = parseWholeNumber(protocol);

    if (
      Number.isNaN(protocolNumber) ||
      protocolNumber === null ||
      protocolNumber < IP_PROTOCOL_MIN_VALUE ||
      protocolNumber > IP_PROTOCOL_MAX_VALUE
    ) {
      isValid = false;
    }

    if (Number.isNaN(protocolNumber)) {
      isValid = false;
    }

    return isValid;
  } catch (e) {
    console.error('Please check ip protocol validator');
    return false;
  }
}

export function isValidIPv6Address(ipv6: string): boolean {
  // check is value any string
  if (ipv6 === 'any' || ipv6 == '00:00::00/0' || ipv6 == '00::00/0') {
    return true;
  }
  // Check if the input is empty or too long
  if (ipv6.length === 0 || ipv6.length > 45) {
    return false;
  }

  // Separate the address and prefix parts if a prefix is present
  const [addressPart, prefixPart] = ipv6.split('/');

  // Handle IPv4-mapped addresses (starts with '::')
  if (addressPart.startsWith('::')) {
    const ipv4Part = addressPart.substring(2);

    // Check if the remaining part is a valid IPv4 address
    if (!isValidIPv4(ipv4Part)) {
      return false;
    }

    // IPv4-mapped addresses have no prefix
    if (prefixPart !== undefined) {
      return false;
    }

    return true;
  }

  // Split the address part into segments by ':'
  const segments = addressPart.split(':');

  // Number of segments, colons, and empty segments
  let segmentCount = 0;
  let emptySegmentCount = 0;

  for (const segment of segments) {
    // Count empty segments
    if (segment.length === 0) {
      emptySegmentCount++;
    }

    // Check if the segment contains only hexadecimal characters
    if (!/^[0-9A-Fa-f]{0,4}$/.test(segment)) {
      return false;
    }

    segmentCount++;
  }

  // Validate compressed format
  if (addressPart.includes('::')) {
    // '::' should appear at most once
    if (addressPart.indexOf('::') !== addressPart.lastIndexOf('::')) {
      return false;
    }

    // If '::' is at the beginning or end, there should be at least one empty segment
    if (addressPart.startsWith('::') && emptySegmentCount === 0) {
      return false;
    }

    if (addressPart.endsWith('::') && emptySegmentCount === 0) {
      return false;
    }

    // Total segments (excluding '::') should not exceed 8
    const totalSegments = segmentCount + emptySegmentCount;
    if (totalSegments > 8) {
      return false;
    }
  } else {
    // If not compressed format, there should be exactly 8 segments
    if (segmentCount !== 8) {
      return false;
    }
  }

  // Validate the prefix part if present
  if (prefixPart !== undefined) {
    const prefixValue = parseInt(prefixPart, 10);
    if (isNaN(prefixValue) || prefixValue < 0 || prefixValue > 128) {
      return false;
    }
  }

  return true;
}

export function isValidIPv4(ip: string) {
  // check is value any string or zeros
  if (ip === 'any' || ip === '0.0.0.0/0') {
    return true;
  }
  const ipv4WithSubnetRegex =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}(\/(3[0-2]|[1-2]?[0-9]))?$/;

  if (!ipv4WithSubnetRegex.test(ip)) {
    return false;
  }

  const octets = (ip.split('/')[0]).split('.');

  for (const octet of octets) {
    if (octet.length > 1 && octet[0] === '0') {
      return false;
    }
  }

  return true;
}

// We need this method since native javascript method parseInt
// will parse number 123 from string value '123something' which is
// unwanted behaviour here

function parseWholeNumber(str: string): number | null {
  // Check if the string is composed of numeric values
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  } else {
    return null;
  }
}

export function isValidPort(port: string | undefined) {
  if (port === 'any' || port == '' || port == undefined) {
    return true;
  }

  const portNumber: number = parseInt(port, 10);

  if (
    parseWholeNumber(port) != null &&
    portNumber >= 0 &&
    portNumber <= 65536
  ) {
    return true;
  } else {
    port = port.replace(/\s/g, '');

    // check if ports are passed as range

    if (port.includes('-')) {
      const splittedByDashArray = port.split('-');

      // 443-65536
      if (splittedByDashArray.length !== 2) {
        return false;
      }

      for (let i = 0; i < splittedByDashArray.length; i++) {
        if (parseWholeNumber(splittedByDashArray[i]) == null) {
          return false;
        }
      }

      if (
        parseInt(splittedByDashArray[0], 10) < PORT_MIN_VALUE ||
        parseInt(splittedByDashArray[0], 10) > PORT_MAX_VALUE ||
        parseInt(splittedByDashArray[1], 10) < PORT_MIN_VALUE ||
        parseInt(splittedByDashArray[1], 10) > PORT_MAX_VALUE
      ) {
        return false;
      }

      if (
        parseInt(splittedByDashArray[0], 10) > parseInt(splittedByDashArray[1], 10)
      ) {
        return false;
      }

      return true;
    }

    if (port.includes(',')) {
      const splittedByCommaArray = port.split(',');

      // we need to check if all values from splitted string are numbers
      for (let i = 0; i < splittedByCommaArray.length; i++) {
        if (parseWholeNumber(splittedByCommaArray[i]) === null) {
          return false;
        }
      }

      return true;
    }

    return false;
  }
}

export function isValidURL(url: string) {
  const pattern = new RegExp('^(?!.*\\n)(https?://)?(www\\.)?([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})(/[a-zA-Z0-9.-/]*)?$', 'i');
  return pattern.test(url);
}

export function isValidUrlGroup(urls: string) {
  if (!urls) { return false; }
  const urlsArray = urls.split(',');

  for (let i = 0; i < urlsArray.length; i++) {
    if (!isValidURL(urlsArray[i].replace(/^\s+|\s+$/g, '').replace(/^\n+|\n+$/g, ''))) {
      return false;
    }
  }

  return true;
}

export function isValidSNIsGroup(snis: string) {
  if (!snis) { return false; }
  snis = snis.replace(/\s/g, '');

  const SNIsArray = snis.split(',');

  for (let i = 0; i < SNIsArray.length; i++) {
    if (
      !isEndsWithClassificator(SNIsArray[i]) &&
      !isValidURL(SNIsArray[i]) &&
      !isStartsWithClassificator(SNIsArray[i]) &&
      !isContainsClassificator(SNIsArray[i])
    ) {
      return false;
    }
  }

  return true;
}

function isStartsWithClassificator(domainName: string) {
  if (domainName.endsWith('/*')) {
    return isValidURL(domainName.split('/')[0]);
  } else {
    return false;
  }
}

function isEndsWithClassificator(domainName: string) {
  if (domainName.startsWith('.*.')) {
    return isValidURL(domainName.slice(3));
  } else if (domainName.startsWith('*.')) {
    return isValidURL(domainName.slice(2));
  } else {
    return false;
  }
}

function isContainsClassificator(domainName: string) {
  if (domainName.startsWith('(') && domainName.endsWith(')')) {
    return isValidURL(domainName.replace(/[\(\)]/g, ''));
  }
  return false;
}

export function transformEndWithValue(endsWithValue: string) {
  if (!endsWithValue.startsWith('*.') && !endsWithValue.startsWith('.*.')) {
    return null;
  }

  let trailingDomain;
  if (endsWithValue.startsWith('.*.')) {
    trailingDomain = endsWithValue.slice(3);
  } else {
    trailingDomain = endsWithValue.slice(2);
  }

  if (!isValidURL(trailingDomain)) {
    return null;
  }

  // We need to remove leading dot since that dot should not be escaped with backslashes
  let transformedValue = endsWithValue.startsWith('.*.') ? endsWithValue.slice(1) : endsWithValue;

  transformedValue = replaceAll(transformedValue, '.', '\\.');

  transformedValue = `.${transformedValue}$`;

  return transformedValue;
}

function replaceAll(initialValue: string, search: string, replacement: string) {
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(escapedSearch, 'g');

  return initialValue.replace(regex, replacement);
}

export function transformSNIGroup(snigroup: string): string[] {
  snigroup = snigroup || '';
  snigroup = snigroup.replace(/\s/g, '');
  const snisArray = snigroup.split(',');

  for (let i = 0; i < snisArray.length; i++) {
    if (isEndsWithClassificator(snisArray[i])) {
      snisArray[i] = transformEndWithValue(snisArray[i]) ?? '';
    }
  }

  return snisArray;
}

export function inverseTransformSNIGroup(snigroup: string[]) {
  const snisArray = snigroup || [];

  for (let i = 0; i < snisArray.length; i++) {
    const transformedValue = inverseTransformEndWithValue(snisArray[i]);
    if (transformedValue !== null) {
      snisArray[i] = transformedValue;
    }
  }

  return snisArray.join(',');
}

export function inverseTransformEndWithValue(transformedValue: string) {
  if (transformedValue === '') {
    return null;
  }

  if (!(transformedValue.startsWith('*.') || transformedValue.startsWith('.*\\.'))) {
    return null;
  }

  // Remove the trailing '$' if present
  transformedValue = transformedValue.replace(/\$$/, '');

  // Replace backslashes
  transformedValue = transformedValue.replace(/\\/g, '')

  return transformedValue;
}
