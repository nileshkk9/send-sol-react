export const Idl = {
  version: "0.1.0",
  name: "basic_1",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "myAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: "u64",
        },
      ],
    },
    {
      name: "update",
      accounts: [
        {
          name: "myAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: "u64",
        },
      ],
    },
    {
      name: "increment",
      accounts: [
        {
          name: "myAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "decrement",
      accounts: [
        {
          name: "myAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "MyAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "data",
            type: "u64",
          },
        ],
      },
    },
  ],
  metadata: {
    address: "2FTQE9cVmDgA9zmzt5BsRp2JNUdoB4PBPvrgwVowDni2",
  },
};