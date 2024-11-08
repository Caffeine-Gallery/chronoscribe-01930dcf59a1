export const idlFactory = ({ IDL }) => {
  const TimerId = IDL.Nat;
  return IDL.Service({
    'cancelTimer' : IDL.Func([TimerId], [], []),
    'getRandomPrompt' : IDL.Func([], [IDL.Text], []),
    'getWritings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'saveWriting' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'startTimer' : IDL.Func([], [TimerId], []),
  });
};
export const init = ({ IDL }) => { return []; };
