import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import type { Form } from "tinacms";

export const useLocalStorage = (form: Form) => {
  const path = useRouter().asPath;
  const [storage, setStorage] = useState<Storage>();

  // get access to localStorage
  useEffect(() => {
    const localStorage = window.localStorage;
    setStorage(localStorage);

    const localData = localStorage.getItem(path);

    if (localData) {
      const parsedData: FormData = JSON.parse(localData);
      form.updateValues(parsedData);
    }
  }, [path, form]);

  // change local storage on value change
  useEffect(() => {
    const json = JSON.stringify(form.values);
    storage?.setItem(path, json);

    // clean local storage on unmount, if no changes occured or form was saved
    return () => {
      if (!form.dirty) storage?.removeItem(path);
    };
  }, [form.values, form.dirty, storage, path]);
};
