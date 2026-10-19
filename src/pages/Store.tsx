import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataState } from '@/components/ui/DataState';
import { PageHero } from '@/components/ui/PageHero';
import { Stamp } from '@/components/ui/Stamp';
import { FALLBACK_PRODUCT, FALLBACK_RELATED_PRODUCTS } from '@/config/fallbacks';
import { IMG } from '@/config/images';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import { pick } from '@/i18n';
import { mediaUrl } from '@/services/api';
import type { Product, StrapiDocument } from '@/types';

interface ProductVM {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  description: string;
  features: string[];
  sizes: string[];
  gallery: string[];
}

const FALLBACK_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

/**
 * Store — product detail driven by the `products` Strapi collection:
 * the newest product is featured, the rest power the "complete the look"
 * carousel. Design placeholders render while the CMS is empty.
 */
export default function StorePage() {
  const { lang, t } = useLanguage();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState('M');
  const [added, setAdded] = useState(false);

  const { data: products, loading, error, refetch } = useStrapi<StrapiDocument<Product>[]>(
    '/products',
    {
      locale: lang,
      sort: 'createdAt:desc',
      populate: 'images',
      pagination: { page: 1, pageSize: 12 },
    },
  );

  const [featured, related] = useMemo((): [ProductVM, ProductVM[]] => {
    const cms: ProductVM[] = (products ?? []).map((product) => ({
      id: product.documentId,
      name: product.name.toUpperCase(),
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? undefined,
      badge: product.badge ?? undefined,
      description: product.description || '',
      features: product.features ?? [],
      sizes: product.sizes?.length ? product.sizes : FALLBACK_SIZES,
      gallery:
        product.images
          ?.map((image) => mediaUrl(image.url))
          .filter((url): url is string => Boolean(url)) ?? [],
    }));

    if (cms.length === 0) {
      const fallback: ProductVM = {
        id: 'fallback',
        name: FALLBACK_PRODUCT.name.toUpperCase(),
        price: FALLBACK_PRODUCT.price,
        compareAtPrice: FALLBACK_PRODUCT.compareAtPrice,
        badge: FALLBACK_PRODUCT.badge,
        description: pick(lang, FALLBACK_PRODUCT.description),
        features: FALLBACK_PRODUCT.features,
        sizes: FALLBACK_SIZES,
        gallery: [...FALLBACK_PRODUCT.gallery],
      };
      return [fallback, []];
    }

    const [first, ...rest] = cms;
    return [first, rest];
  }, [products, lang]);

  const gallery = featured.gallery.length > 0 ? featured.gallery : [...FALLBACK_PRODUCT.gallery];

  const relatedCards = related.length
    ? related.map((product) => ({
        id: product.id,
        name: product.name,
        price: `€${product.price}`,
        tag: product.badge || t('common.view'),
        img: product.gallery[0] ?? IMG.jacket,
      }))
    : FALLBACK_RELATED_PRODUCTS.map((product) => ({
        id: product.name,
        name: product.name,
        price: product.price,
        tag: pick(lang, product.tag),
        img: product.img,
      }));

  return (
    <div className="pb-24">
      <PageHero img={gallery[0]} kicker={t('store.kicker')} title={t('sec.store')} />

      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-10">
        <DataState
          loading={loading}
          error={error}
          loadingMessage={t('store.loading')}
          errorMessage={t('store.error')}
          onRetry={refetch}
        />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* GALLERY */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-coal-700">
              <img src={gallery[active]} alt={featured.name} className="size-full object-cover" />
              <span className="absolute left-4 top-4 bg-rust-500 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-widest text-black">
                {featured.badge ?? t('store.limited')}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`${featured.name} — ${index + 1}`}
                  className={`aspect-square overflow-hidden border transition-colors ${
                    active === index
                      ? 'border-ignition-500'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={photo}
                    alt=""
                    className={`size-full object-cover ${active === index ? '' : 'opacity-60'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <Stamp className="mb-4">{t('store.madeIn')}</Stamp>
            <h1 className="font-display text-4xl leading-[0.95] tracking-wide md:text-5xl">
              {featured.name}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <span className="font-display text-4xl text-ignition-500">€{featured.price}</span>
              {featured.compareAtPrice ? (
                <span className="font-condensed text-lg text-steel-300 line-through">
                  €{featured.compareAtPrice}
                </span>
              ) : null}
            </div>

            <p className="mt-5 max-w-md font-condensed text-lg text-steel-300">
              {featured.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {featured.features.map((feature) => (
                <span
                  key={feature}
                  className="border border-white/15 px-3 py-1.5 font-condensed text-xs font-semibold uppercase tracking-widest text-steel-300"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* SIZE SELECTOR */}
            <div className="mt-8">
              <span className="mb-3 block font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
                {t('size')}
              </span>
              <div className="flex flex-wrap gap-2">
                {featured.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    className={`size-12 border font-condensed font-bold uppercase transition-colors ${
                      size === option
                        ? 'border-ignition-500 bg-ignition-500 text-black'
                        : 'border-white/15 text-steel-300 hover:border-ignition-500/60 hover:text-chalk-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 hidden gap-3 lg:flex">
              <button
                type="button"
                onClick={() => setAdded(true)}
                className="glow-orange slash-r bg-ignition-500 px-8 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500"
              >
                {t('cta.saddlebag')} — €{featured.price}
              </button>
              <button
                type="button"
                aria-label="♥"
                className="slash-l border-2 border-ignition-500 px-6 py-4 font-condensed text-base font-bold uppercase tracking-widest text-ignition-500 transition-colors hover:bg-ignition-500 hover:text-black"
              >
                ♥
              </button>
            </div>
            {added ? (
              <p className="mt-3 font-condensed text-sm uppercase tracking-widest text-ignition-500">
                {t('store.added', { size })}
              </p>
            ) : null}
          </div>
        </div>

        {/* RELATED CAROUSEL */}
        <div className="mt-24">
          <h2 className="mb-6 font-display text-4xl tracking-wide">{t('related')}</h2>
          <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
            {relatedCards.map((product) => (
              <article
                key={product.id}
                className="group w-64 flex-none snap-start border border-white/10 bg-coal-800 transition-colors hover:border-ignition-500/60"
              >
                <div className="relative aspect-square overflow-hidden bg-coal-700">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="size-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 font-condensed text-xs font-semibold uppercase tracking-widest text-ignition-500 backdrop-blur">
                    {product.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-condensed text-lg font-semibold uppercase leading-tight tracking-wide">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-2xl text-ignition-500">{product.price}</span>
                    <span className="border border-white/15 px-3 py-2 font-condensed text-xs font-bold uppercase tracking-widest text-chalk-50 transition-colors group-hover:border-ignition-500 group-hover:text-ignition-500">
                      {t('common.view')}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Link
            to="/"
            className="font-condensed text-sm uppercase tracking-widest text-steel-300 hover:text-ignition-500"
          >
            {t('back')}
          </Link>
        </div>
      </section>

      {/* STICKY ADD-TO-CART (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-coal-950/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3">
          <div>
            <div className="font-condensed text-xs uppercase tracking-widest text-steel-300">
              {t('size')} {size}
            </div>
            <div className="font-display text-2xl text-ignition-500">€{featured.price}</div>
          </div>
          <button
            type="button"
            onClick={() => setAdded(true)}
            className="glow-orange slash-r flex-1 bg-ignition-500 px-6 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500"
          >
            {t('cta.saddlebag')}
          </button>
        </div>
      </div>
    </div>
  );
}
