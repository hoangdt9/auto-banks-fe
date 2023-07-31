export const cancellablePromise = (promise: Promise<any | void>) => {
  const isCancelled = { value: false };
  const wrappedPromise = new Promise((res, rej) => {
    promise
      .then((d) => {
        return isCancelled.value ? rej(isCancelled) : res(d);
      })
      .catch((e) => {
        rej(isCancelled.value ? isCancelled : e);
      });
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCancelled.value = true;
    },
  };
};
