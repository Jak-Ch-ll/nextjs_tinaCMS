import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { Form, useCMS } from "tinacms"

export const useLocalStorage = (form: Form) => {
  const cms = useCMS()

  const path = useRouter().asPath
  const [storage, setStorage] = useState<Storage>()

  // get access to localStorage
  useEffect(() => {
    const localStorage = window.localStorage
    setStorage(localStorage)

    const localData = localStorage.getItem(path)

    if (localData) {
      const parsedData: FormData = JSON.parse(localData)
      form.updateValues(parsedData)

      if (form.dirty) {
        cms.alerts.info(
          "Loading unsaved changes from last time, use reset in the sidebar to delete",
          10000
        )
      }
    }
  }, [path, form, cms])

  // change local storage on value change
  useEffect(() => {
    const json = JSON.stringify(form.values)
    storage?.setItem(path, json)
  }, [form.values, storage, path])

  // cleanup local storage on unmount or window cloase if no changes occured (or if they were saved)
  useEffect(() => {
    const cleanup = () => {
      if (!form.dirty) storage?.removeItem(path)
    }

    // runs on window/tab/browser close
    window.addEventListener("beforeunload", cleanup)

    return () => {
      // run cleanup on unmount
      cleanup()
      window.removeEventListener("beforeunload", cleanup)
    }
  }, [form.dirty, storage, path])
}
