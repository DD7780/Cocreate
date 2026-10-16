type SubmissionResult = { status: string; message?: string };

type SubmissionOptions = {
  requestId: { current: string | undefined };
  flush: () => Promise<void>;
  submit: (requestId: string) => Promise<SubmissionResult>;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
};

/** One explicit gesture; uncertain submissions keep their replay-safe identity. */
export async function submitDraftChanges({
  requestId,
  flush,
  submit,
  onNotice,
  onError,
}: SubmissionOptions): Promise<void> {
  onError('');
  onNotice('Saving your changes before building…');
  try {
    await flush();
    onNotice('Submitting your changes…');
    const recovering = !!requestId.current;
    const send = async () => {
      requestId.current ||= crypto.randomUUID();
      const result = await submit(requestId.current);
      requestId.current = undefined;
      return result;
    };
    let result = await send();
    // A failed replay confirms no new capture occurred. This click authorizes one
    // fresh submission; an uncertain or successful replay must keep its identity.
    if (recovering && result.status === 'failed') result = await send();
    if (result.status === 'failed') {
      onNotice('');
      onError(result.message || 'Your submission failed. Your edits are retained; try Build my changes again.');
    } else {
      onNotice(result.message || 'Changes submitted.');
    }
  } catch (error) {
    onNotice('');
    onError(error instanceof Error ? error.message : 'Your changes could not be submitted. Try Build my changes again.');
  }
}
