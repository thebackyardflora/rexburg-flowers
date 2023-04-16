import mailchimp from '@mailchimp/mailchimp_marketing';
import invariant from 'tiny-invariant';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
});

export async function addUserToDefaultList({ email }: { email: string }) {
  invariant(process.env.MAILCHIMP_LIST_ID, 'MAILCHIMP_LIST_ID is required');

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'pending',
    });

    return true;
  } catch (err) {
    if (isErrorResponse(err)) {
      const data = await err.response.body;
      if (/member exists/i.test(data.title)) {
        return true;
      } else {
        console.error(JSON.stringify(data));
        return false;
      }
    }

    console.error(err);

    return false;
  }
}

type FullErrorResponse = {
  response: {
    body: {
      title: string;
      status: number;
      detail: string;
    };
  };
};

function isErrorResponse(err: unknown): err is FullErrorResponse {
  return (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof err.response === 'object' &&
    err.response !== null &&
    'body' in err.response
  );
}
