# UEI Green Energy Check

Live Project Link: [https://uei-green-energy-check.vercel.app/](https://uei-green-energy-check.vercel.app/)

## Description

This decentralized energy marketplace is built on the Solana blockchain, enabling users to manage and trade renewable and non-renewable energy. The platform allows energy producers to list available energy at a specified rate, while consumers can purchase energy and charge their electric vehicles (EVs) using energy from designated charging points. It incorporates Solana's smart contracts to ensure seamless and transparent transactions between producers, consumers, and charging stations. The focus is on promoting green energy, with a mechanism to differentiate between green and non-green energy, supporting the transition to renewable energy sources.

## Features

- **Energy Producer Creation:**:Producers can register as energy providers by defining the total energy available and setting rates for green or non-green energy.
- **Charging Point Setup:**: Charging station owners can create charging points, specifying different rates for green and non-green energy.
- **Chargin Points buys From Producers**: The Charging Points buy from Producers(they buy from Green Producers if they want green energy or vice versa)
- **EV Charging thorugh Charging Points:**:  Users can charge their EVs at charging stations using the purchased energy.They can opt for if they want to use Green or Non Green Energy. The system checks for sufficient energy availability (green or non-green) before proceeding with the charging process.

## Website Demo

![Mission Dashboard](https://github.com/akshaydhayal/UEI-Green-Energy-Check/blob/main/Green-Energy-Management.png)

*Figure 1: Create Energy Producers and Charginf Points to interact with later*

![Mission Details](https://github.com/akshaydhayal/UEI-Green-Energy-Check/blob/main/Green-Energy-Management%20(1).png)

*Figure 2: Energy Transactions Section(b/w Producer-Charging Point and b/w Charging Point-Consumer)*
![Mission Details](https://github.com/akshaydhayal/UEI-Green-Energy-Check/blob/main/Green-Energy-Management%20(3).png)

*Figure 3: All Available Producers and Charging Points created*



## Video Demo:

[https://www.loom.com/share/598e67c7c9374cda816deeb82681077e?sid=8655ffa0-2735-4bf8-b59a-d89b900511bc](https://www.loom.com/share/598e67c7c9374cda816deeb82681077e?sid=8655ffa0-2735-4bf8-b59a-d89b900511bc)


## Technologies Used

- **Frontend**: Next.js, React, Recoil, Tailwind CSS, Lucide Icons
- **Contract/Ledger**: Solana Smart Contract with Anchor

  ## Assumption made
- **Green Producer**: A Producer can either be Green or Non Green Energy Producer.(So that It is easy to implement REC.A green Energy producer can transfer REC to Charging Points but Non Green Producers can't.) 
