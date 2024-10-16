interface MahjongTile {
    suit: 'bamboo' | 'character' | 'dots' | 'wind' | 'dragon';
    value: string; // '1' to '9' for suits, 'east'|'south'|'west'|'north' for winds, 'red'|'green'|'white' for dragons
}

interface MahjongHand {
    tiles: MahjongTile[];
    melds: {
        type: 'chow' | 'pung' | 'kong';
        tiles: MahjongTile[];
    }[];
    concealed: MahjongTile[];
}

export type { MahjongHand, MahjongTile };