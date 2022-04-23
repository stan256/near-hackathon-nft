use near_contract_standards::non_fungible_token::metadata::{
  NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LazyOption;
use near_sdk::{
  env, near_bindgen, AccountId, BorshStorageKey, PanicOnDefault, Promise, PromiseOrValue,
};

near_contract_standards::impl_non_fungible_token_core!(Contract, tokens);
near_contract_standards::impl_non_fungible_token_approval!(Contract, tokens);
near_contract_standards::impl_non_fungible_token_enumeration!(Contract, tokens);

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
  tokens: NonFungibleToken,
  metadata: LazyOption<NFTContractMetadata>,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
  NonFungibleToken,
  Metadata,
  TokenMetadata,
  Enumeration,
  Approval,
}

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for Contract {
  fn nft_metadata(&self) -> NFTContractMetadata {
    self.metadata.get().unwrap()
  }
}

#[near_bindgen]
impl Contract {
  #[init]
  pub fn new_default_meta(owner_id: AccountId) -> Self {
    Self::new(
      owner_id,
      NFTContractMetadata {
        spec: NFT_METADATA_SPEC.to_string(),
        name: "Junkwin's Near Spring Hackathon collection".to_string(),
        symbol: "UA".to_string(),
        icon: None,
        base_uri: None,
        reference: None,
        reference_hash: None,
      },
    )
  }

  #[init]
  pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
    assert!(!env::state_exists(), "Already initialized");
    metadata.assert_valid();
    Self {
      tokens: NonFungibleToken::new(
        StorageKey::NonFungibleToken,
        owner_id,
        Some(StorageKey::TokenMetadata),
        Some(StorageKey::Enumeration),
        Some(StorageKey::Approval),
      ),
      metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
    }
  }

  #[payable]
  pub fn nft_mint(&mut self, token_id: TokenId, receiver_id: AccountId, token_metadata: TokenMetadata) -> Token {
    self.tokens.internal_mint(token_id, receiver_id, Some(token_metadata))
  }
}
