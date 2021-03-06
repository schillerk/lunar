import React from 'react';
import DateTimeSelect, { Props } from '@airbnb/lunar/lib/components/DateTimeSelect';
import useFormField, { FieldProps } from '../../hooks/useFormField';
import { toString } from '../../helpers';

/** `DateTimeSelect` automatically connected to the parent `Form`.  */
export default function FormDateTimeSelect(props: FieldProps<string, Props>) {
  const fieldProps = useFormField(props, {
    initialValue: new Date().toISOString(),
    parse: toString,
  });

  return <DateTimeSelect {...fieldProps} />;
}
